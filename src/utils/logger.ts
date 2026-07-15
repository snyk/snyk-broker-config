import bunyan from '@expo/bunyan'
import {getConfig} from '../config/config.js'

const SERVICE_NAME = 'snyk-broker-config'
export type Logger = bunyan
export function createLogger(): Logger {
  const log = bunyan.createLogger({
    name: SERVICE_NAME,
    // Keep logs on stderr so stdout carries only the data payload.
    streams: [{stream: process.stderr}],
  })
  type LogLevels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

  log.level((getConfig().LOG_LEVEL as LogLevels) || 'info')

  return log
}
