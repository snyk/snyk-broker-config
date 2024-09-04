import {loadConfig} from 'snyk-config'
import {findPackageJsonDir} from '../utils/utils.js'

export interface Config {
  API_HOSTNAME: string
  API_VERSION: string
  API_VERSION_TENANTS: string
  APP_INSTALL_API_VERSION: string
  MAX_RETRY: number
  LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

const loadedConfig = loadConfig(findPackageJsonDir())

export const getConfig = () => loadedConfig as unknown as Config
