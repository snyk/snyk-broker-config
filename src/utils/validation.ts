export function isValidUUID(val: string): boolean {
  const uuidRegex = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
  return uuidRegex.test(val)
}
