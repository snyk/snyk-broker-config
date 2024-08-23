import path from 'node:path'
import fs from 'node:fs'
import {fileURLToPath} from 'node:url'

// Get __dirname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function findPackageJsonDir(dir: string = __dirname): string {
  const packageJsonPath = path.join(dir, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    return dir
  }

  const parentDir = path.dirname(dir)

  if (parentDir === dir) {
    throw new Error('Could not find root directory')
  }

  // Recur to the parent directory
  return findPackageJsonDir(parentDir)
}
