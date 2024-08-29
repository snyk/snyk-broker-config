export function isValidUUID(val: string): boolean {
  const uuidRegex = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
  return uuidRegex.test(val)
}

export function isValidHostnameWithPort(hostname: string) {
  const regex = /^(?!:\/\/)([\w-]{1,63}\.)*[\dA-Za-z][\w-]{0,62}\.[A-Za-z]{2,6}(:\d{1,5})?$/
  return regex.test(hostname)
}

export function isValidUrl(url: string) {
  const regex = /^(https?:\/\/)([\w-]{1,63}\.)*[\dA-Za-z][\w-]{0,62}\.[A-Za-z]{2,6}(:\d{1,5})?(\/.*)?$/
  return regex.test(url)
}
