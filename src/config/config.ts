import {loadConfig} from 'snyk-config'
import {findPackageJsonDir} from '../utils/utils.js'

export interface Config {
  API_HOSTNAME: string
  API_VERSION: string
  API_VERSION_TENANTS: string
  APP_INSTALL_API_VERSION: string
  APP_SECRET_API_VERSION: string
  /**
   * Connection types where an Org may hold more than one integration, so a
   * Connection has to say which one it binds to. Mirrors the same list in
   * Registry and hybrid-platform-service.
   */
  MULTIPLE_PROFILE_CONNECTION_TYPES: string[]
  MAX_RETRY: number
  LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

const loadedConfig = loadConfig(findPackageJsonDir())

export const getConfig = () => loadedConfig as unknown as Config
