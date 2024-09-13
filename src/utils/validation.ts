export function isValidUUID(val: string): boolean {
  const uuidRegex = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
  return uuidRegex.test(val)
}

export function isValidHostnameWithPort(hostname: string): boolean {
  const regex =
    /^(?!:\/\/)([\dA-Za-z-]{1,63})(\.[\dA-Za-z-]{1,63})*(\.[A-Za-z]{2,6})?(:\d{1,5})?(\/[\w!$%&'()*+,./:;=@~-]*)?$/
  return regex.test(hostname)
}

export function isValidUrl(url: string): boolean {
  const regex = /^(https?:\/\/)([\dA-Za-z-]{1,63})(\.[\dA-Za-z-]{1,63})*(\.[A-Za-z]{2,6})?(:\d{1,5})?(\/.*)?$/
  return regex.test(url)
}

export function isNotProhibitedValue(prohibitedValues: string[], value: string) {
  return !prohibitedValues.includes(value)
}

export function isValidEnvVar(name: string): boolean {
  const regex = /^[A-Z_][A-Z0-9_]*$/
  return regex.test(name)
}
