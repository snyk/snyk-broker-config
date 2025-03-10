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

export interface CreatedOrgV1 {
  id: string
  name: string
  slug: string
  url: string
  created: string
  group?: {
    name: string
    id: string
  }
}

export interface CreateOrgV1 {
  name: string
  groupId?: string
}

export interface Orgs {
  id: string
  type: string
  attributes: {
    access_requests_enabled: boolean
    created_at: string
    group_id: string
    is_personal: boolean
    name: string
    slug: string
    updated_at: string
  }
}
export interface OrgsListResponse {
  data: Array<Orgs>
}

export interface OrgsInstall {
  id: string
  type: string
  attributes: {
    client_id: string
    installed_at: string
  }
}
export interface OrgsInstallsResponse {
  data: Array<OrgsInstall>
}

export interface AppInstallsDataAttributes {
  client_id: string
  installed_at: string
}
export interface AppInstallsRelationships {
  app: {
    data: {
      id: string
      type: string
    }
  }
}
export interface AppInstallsData {
  attributes: AppInstallsDataAttributes
  id: string
  type: string
  relationships: AppInstallsRelationships
}

interface JsonApi {
  version: string
}

type Link =
  | string
  | {
      href: string
      meta?: Record<string, any>
    }

interface Links {
  self: Link
  next?: Link
}

export interface AppInstallsApiResponse {
  data: AppInstallsData[]
  jsonapi: JsonApi
  links: Links
}
