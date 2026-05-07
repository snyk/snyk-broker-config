import {randomUUID} from 'node:crypto'

const interactionId = randomUUID()

export const getCommonHeaders = () => ({
  'Content-Type': 'application/vnd.api+json',
  'SNYK-INTERACTION-ID': interactionId,
})
