import http from 'node:http'
import https from 'node:https'

export interface HttpRequest {
  url: string
  headers: Object
  method: string
  body?: string | Buffer | Uint8Array
}

export interface HttpResponse {
  headers: Object
  statusCode: number | undefined
  statusText?: string
  body: any
}
const MAX_RETRY = 3

export const makeRequest = async (req: HttpRequest, retries = MAX_RETRY): Promise<HttpResponse> => {
  const localRequest = req

  const httpClient = localRequest.url.startsWith('https') ? https : http
  const options: http.RequestOptions = {
    method: localRequest.method,
    headers: localRequest.headers as any,
  }
  return new Promise<HttpResponse>((resolve, reject) => {
    try {
      const request = httpClient.request(localRequest.url, options, (response) => {
        let data = ''

        // A chunk of data has been received.
        response.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received.
        response.on('end', () => {
          if (response.statusCode && response.statusCode > 299 && response.statusCode !== 404) {
            const errors = (JSON.parse(data).errors as Array<any>) ?? ''
            reject(
              `${response.statusCode}: ${response.statusMessage}.\n\n- Url: (${req.method})${req.url}.\n\n- ${errors.map((error) => error.detail).join(';')}`,
            )
          }
          resolve({
            headers: response.headers,
            statusCode: response.statusCode,
            statusText: response.statusMessage || '',
            body: data,
          })
        })

        response.on('error', (error) => {
          if (retries > 0) {
            console.warn({msg: localRequest.url}, `Downstream response failed. Retrying after 500ms...`)
            setTimeout(() => {
              resolve(makeRequest(localRequest, retries - 1))
            }, 500) // Wait for 0.5 second before retrying
          } else {
            console.error({error}, `Error getting response from downstream. Giving up after ${MAX_RETRY} retries.`)
            reject(error)
          }
        })
      })
      request.on('error', (error) => {
        console.error({error}, 'Error making request to downstream.')
        reject(error)
      })
      if (localRequest.body) {
        request.write(localRequest.body)
      }
      request.end()
    } catch (error) {
      reject(error)
    }
  })
}
