import {cwd} from 'node:process'
import {resolve} from 'node:path'
import {loadConfig} from 'snyk-config'

export interface Config {
  API_HOSTNAME: string
  API_VERSION: string
  APP_INSTALL_API_VERSION: string
  MAX_RETRY: number
  LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

const loadedConfig = loadConfig(resolve(cwd()))

export const getConfig = () => loadedConfig as unknown as Config
