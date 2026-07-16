import type {HttpRequest, HttpResponse} from './http-request.js'

const MAX_RAW_DETAIL_LENGTH = 500

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

// A 404 response. Collection lookups treat this as "none exist"; specific-id
// lookups let it surface as a failure like any other ApiError.
export class NotFoundError extends ApiError {
  constructor(fields: ApiErrorFields) {
    super(fields)
    this.name = 'NotFoundError'
  }
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
    const parsed = JSON.parse(body)
    const errors = (parsed?.errors as Array<{id?: string; detail?: string; details?: string}>) ?? []
    bodyRequestId = errors.find((error) => error.id)?.id
    detail = errors
      .map((error) => error.detail ?? error.details)
      .filter(Boolean)
      .join('; ')
  } catch {
    detail = body?.trim().slice(0, MAX_RAW_DETAIL_LENGTH)
  }

  const requestId =
    (Array.isArray(headerRequestId) ? headerRequestId[0] : headerRequestId) ?? bodyRequestId ?? fallbackRequestId

  const ErrorClass = response.statusCode === 404 ? NotFoundError : ApiError
  return new ErrorClass({
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
