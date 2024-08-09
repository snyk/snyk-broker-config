import {configureLogger, Logger} from '@snyk/log'
import {getConfig} from '../config/config.js'

const SERVICE_NAME = 'snyk-broker-config'

export function createLogger(name: string): Logger {
  return configureLogger({
    name: SERVICE_NAME,
    maxLogDepth: 5,
    level: getConfig().LOG_LEVEL,
  })(name)
}
