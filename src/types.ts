export interface SetupParameters {
  installId: string
  tenantId: string
  appInstalledOnOrgId: string
}

export type TenantId = string
export type InstallId = string
export type DeploymentId = string
export type ConnectionId = string
export type ConnectionSelection = {id: ConnectionId; type: string}
export interface ContextSelection {
  id: string
  context: Record<string, string>
}
