import type {HttpRequest, HttpResponse} from './http-request.js'

export interface ApiErrorFields {
  statusCode: number | undefined
  statusText: string
  requestId: string
  detail: string
  url: string
  method: string
  interactionId: string
  operation: string
}

export class ApiError extends Error {
  readonly statusCode: number | undefined
  readonly requestId: string
  readonly detail: string
  readonly url: string
  readonly method: string
  readonly interactionId: string
  readonly operation: string

  constructor(fields: ApiErrorFields) {
    const prefix = fields.operation ? `Failed to ${fields.operation}.\n` : ''
    super(
      `${prefix}${fields.statusCode}: ${fields.statusText}.\n\n` +
        `- Url: (${fields.method})${fields.url}.\n` +
        `- requestId: ${fields.requestId}\n` +
        `- interactionId: ${fields.interactionId}\n\n` +
        `- ${fields.detail}`,
    )
    this.name = 'ApiError'
    this.statusCode = fields.statusCode
    this.requestId = fields.requestId
    this.detail = fields.detail
    this.url = fields.url
    this.method = fields.method
    this.interactionId = fields.interactionId
    this.operation = fields.operation
  }
}

export interface NetworkErrorFields {
  operation: string
  interactionId: string
  code: string
  message: string
}

// A transport failure where no HTTP response was received (connection refused,
// DNS, timeout, TLS/cert errors). No server status, url, or request id applies.
export class NetworkError extends Error {
  readonly operation: string
  readonly interactionId: string
  readonly code: string

  constructor(fields: NetworkErrorFields) {
    const prefix = fields.operation ? `Failed to ${fields.operation}.\n` : ''
    const detail = fields.code ? `${fields.code}: ${fields.message}` : fields.message
    super(`${prefix}- interactionId: ${fields.interactionId}\n\n- ${detail}`)
    this.name = 'NetworkError'
    this.operation = fields.operation
    this.interactionId = fields.interactionId
    this.code = fields.code
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error !== null && typeof error === 'object' && 'message' in error
}

// Builds a NetworkError from a transport-level failure, carrying the failing
// operation and interaction id plus the raw underlying error code and message.
// The Node error code (e.g. ECONNREFUSED, SELF_SIGNED_CERT_IN_CHAIN) is captured
// explicitly because it is often absent from the message text.
export const buildNetworkError = (
  req: Pick<HttpRequest, 'operation'>,
  interactionId: string,
  error: unknown,
): Error => {
  if (!isNodeError(error)) {
    return new Error(String(error))
  }
  return new NetworkError({
    operation: req.operation ?? '',
    interactionId,
    code: error.code ?? '',
    message: error.message,
  })
}
// The JSON:API error body the Snyk backend returns on a failed request, e.g.
// {"errors":[{"detail":"Permission denied","status":"403"}],"jsonapi":{"version":"1.0"}}.
interface ApiErrorBody {
  errors?: Array<{id?: string; detail?: string; status?: string}>
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && (!('errors' in value) || Array.isArray(value.errors))
}

// Builds a structured ApiError from a failed response, resolving the request id
// from the server's snyk-request-id header, then the JSON:API errors[].id, then
// the client-generated fallback. The body is parsed defensively so a non-JSON
// error payload never masks the status code.
export const buildApiError = (
  response: Pick<HttpResponse, 'headers' | 'statusCode' | 'statusText'>,
  body: string,
  req: Pick<HttpRequest, 'method' | 'url' | 'operation'>,
  fallbackRequestId: string,
  interactionId: string,
): ApiError => {
  const headers = (response.headers ?? {}) as Record<string, string | string[] | undefined>
  const headerRequestId = headers['snyk-request-id']

  let bodyRequestId: string | undefined
  let detail: string | undefined

  try {
    const parsed: unknown = JSON.parse(body)
    const errors = isApiErrorBody(parsed) ? (parsed.errors ?? []) : []
    bodyRequestId = errors.find((error) => error.id)?.id
    detail = errors
      .map((error) => error.detail)
      .filter(Boolean)
      .join('; ')
  } catch {
    // if not JSON, use the body
    detail = body?.trim()
  }

  const requestId =
    (Array.isArray(headerRequestId) ? headerRequestId[0] : headerRequestId) ?? bodyRequestId ?? fallbackRequestId

  return new ApiError({
    statusCode: response.statusCode,
    statusText: response.statusText || '',
    requestId,
    detail: detail || response.statusText || '',
    url: req.url,
    method: req.method,
    interactionId,
    operation: req.operation ?? '',
  })
}
