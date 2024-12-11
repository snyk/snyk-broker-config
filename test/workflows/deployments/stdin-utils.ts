import {MockSTDIN} from 'mock-stdin'

export const sendScenario = (stdinFn: MockSTDIN, data: Array<string>) => {
  for (let i = 0; i < data.length; i++) {
    setTimeout(() => {
      stdinFn.send(data[i])
    }, 100 * i)
    setTimeout(
      () => {
        stdinFn.send('\n')
      },
      100 * i + 10,
    )
  }
}
