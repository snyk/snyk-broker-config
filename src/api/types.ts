export interface AppInstallResponseData {
  id: string
  type: string
  attributes: {
    client_id: string
    client_secret: string
  }
  links: {}
  relationships: {
    app: {
      data: {
        id: string
        type: string
      }
    }
  }
}
export interface AppInstallResponse {
  data: AppInstallResponseData
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}
export interface AppInstallsResponse {
  data: AppInstallResponseData[]
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}

export interface AppInstallOutput {
  install_id: string
  client_id: string
  client_secret: string
}

export interface CredentialsAttributes {
  comment: string
  environment_variable_name: string
  type: string
}
export type CredentialsAttributesEnvVarNames = Record<string, string>

export interface CredentialsListResponseData {
  id: string
  type: string
  attributes: CredentialsAttributes
  relationships?: {
    broker_connections: BrokerConnectionRelationshipData[]
  }
}
export interface BrokerConnectionRelationshipData {
  data: {
    id: string
    type: string
  }
}

export interface CredentialsResponse {
  data: CredentialsListResponseData
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}
export interface CredentialsListResponse {
  data: CredentialsListResponseData[]
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}

export interface NewCredentialsResponse {
  data: CredentialsListResponseData[]
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}

export interface ConnectionsAttributes {}
export interface ConnectionResponseData {
  id: string
  type: string
  attributes: any
}

export interface ConnectionResponse {
  data: ConnectionResponseData
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}

export interface ConnectionsResponse {
  data: ConnectionResponseData[]
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}

export interface IntegrationsResponseData {
  org_id: string
  id: string
  type: string
  integration_type: string
}
export interface IntegrationsResponse {
  data: IntegrationsResponseData[]
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
}
export interface IntegrationResponse {
  data: IntegrationsResponseData
  jsonapi: {
    version: string
  }
  links: {
    first?: string
    last?: string
    next?: string
  }
  errors?: any
}
