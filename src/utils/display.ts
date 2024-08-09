export function printFormattedJSON(obj: any, indent: number = 0) {
  const indentation = ' '.repeat(indent)
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      console.log(`${indentation}${key === 'id' ? '-' : ' '} ${key}:`)
      printFormattedJSON(obj[key], indent + 4)
    } else {
      console.log(`${indentation}${key === 'id' ? '\n-' : ' '} ${key}: "${obj[key]}"`)
    }
  }
}
