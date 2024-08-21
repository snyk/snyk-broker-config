import {ux} from '@oclif/core/ux'

export function printFormattedJSON(obj: any, indent: number = 2): string {
  let stringOutput = ''
  const indentation = ' '.repeat(indent)
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      stringOutput += `${indentation}${key === 'id' ? '-' : ' '} ${ux.colorize('yellow', key)}:\n`
      stringOutput += `${printFormattedJSON(obj[key], indent + 4)}\n`
    } else {
      stringOutput += `${indentation}${key === 'id' ? `\n${indentation}-` : ' '} ${ux.colorize('yellow', key)}: ${ux.colorize('green', obj[key])}\n`
    }
  }
  return stringOutput
}
