import {spawnSync} from 'child_process'
import glob from 'glob'

// Find all test files
const testFiles = glob.sync('./test/**/*.test.ts')
let returnCode = 0
const testsSummary = []
testFiles.forEach((file) => {
  const mochaProcess = spawnSync('npx', ['mocha', file], {stdio: 'inherit'})

  if (mochaProcess.status !== 0) {
    console.error(`Test failed in file: ${file} (exit code: ${mochaProcess.status})`)
    returnCode = mochaProcess.status
    testsSummary.push([file, 'Failed'])
  } else {
    testsSummary.push([file, 'Passed'])
  }
})
console.table(testsSummary)
process.exit(returnCode)
