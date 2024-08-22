import {ux} from '@oclif/core/ux'

export function printFormattedJSON(objectReceived: any, indent: number = 2): string {
  let stringOutput = ''
  const indentation = ' '.repeat(indent)
  let obj = structuredClone(objectReceived)
  if (obj.id) {
    const objId = obj.id
    delete obj.id
    const objWithIdFirst = {id: objId, ...obj}
    obj = objWithIdFirst
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      stringOutput += `${indentation}${key === 'id' ? `-` : ' '} ${ux.colorize('yellow', key)}:\n`
      stringOutput += `${printFormattedJSON(obj[key], indent + 4)}\n`
    } else {
      stringOutput += `${indentation}${key === 'id' ? `\n${indentation}-` : ' '} ${ux.colorize('yellow', key)}: ${ux.colorize('green', obj[key])}\n`
    }
  }
  return stringOutput
}

export function printIndexedFormattedJSON(objArray: Array<any>): string {
  let stringOutput = ''
  for (let i = 0; i < objArray.length; i++) {
    stringOutput += `[${i + 1}]${printFormattedJSON(objArray[i])}`
  }
  return stringOutput
}
