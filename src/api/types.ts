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

export interface AppInstallOutput {
  install_id: string
  client_id: string
  client_secret: string
}
