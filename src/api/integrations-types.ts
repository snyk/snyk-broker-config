export interface AcrCredentials {
  username: string
  password: string
  registryBase: string
}
export interface ArtifactoryCrCredentials {
  username: string
  url: string
}
export interface AzureReposCredentials {
  token: string
  url: string
}
export interface BitbucketServerCredentials {
  username: string
  password: string
  url: string
}
export interface DigitalOceanCrCredentials {
  token: string
}
export interface DockerHubCredentials {
  username: string
  password: string
}
export interface EcrCredentials {
  region: string
  roleArn: string
}
export interface GcrCredentials {
  password: string
  registryBase: string
}
export interface GitHubCredentials {
  token: string
}
export interface GitHubCrCredentials {
  username: string
  password: string
  registryBase: string
}
export interface GitHubEnterpriseCredentials {
  token: string
  url: string
}
export interface GitLabCredentials {
  token: string
  url: string
}
export interface GitLabCrCredentials {
  username: string
  password: string
  registryBase: string
}
export interface GoogleArtifactCrCredentials {
  password: string
  registryBase: string
}
export interface HarborCrCredentials {
  username: string
  password: string
  registryBase: string
}
export interface NexusCrCredentials {
  username: string
  password: string
  registryBase: string
}
export interface QuayCrCredentials {
  username: string
  password: string
  registryBase: string
}

export type IntegrationCredentials =
  | AcrCredentials
  | ArtifactoryCrCredentials
  | AzureReposCredentials
  | BitbucketServerCredentials
  | DigitalOceanCrCredentials
  | DockerHubCredentials
  | EcrCredentials
  | GcrCredentials
  | GitHubCredentials
  | GitHubCrCredentials
  | GitHubEnterpriseCredentials
  | GitLabCredentials
  | GitLabCrCredentials
  | GoogleArtifactCrCredentials
  | HarborCrCredentials
  | NexusCrCredentials
  | QuayCrCredentials

export const dummyAcrCredentials: AcrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}
export const dummyArtifactoryCrCredentials: ArtifactoryCrCredentials = {
  username: '',
  url: '',
}
export const dummyAzureReposCredentials: AzureReposCredentials = {
  token: '',
  url: '',
}
export const dummyBitbucketServerCredentials: BitbucketServerCredentials = {
  username: '',
  password: '',
  url: '',
}
export const dummyDigitalOceanCrCredentials: DigitalOceanCrCredentials = {
  token: '',
}
export const dummyDockerHubCredentials: DockerHubCredentials = {
  username: '',
  password: '',
}
export const dummyEcrCredentials: EcrCredentials = {
  region: '',
  roleArn: '',
}
export const dummyGcrCredentials: GcrCredentials = {
  password: '',
  registryBase: '',
}
export const dummyGitHubCredentials: GitHubCredentials = {
  token: '',
}
export const dummyGitHubCrCredentials: GitHubCrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}
export const dummyGitHubEnterpriseCredentials: GitHubEnterpriseCredentials = {
  token: '',
  url: '',
}
export const dummyGitLabCredentials: GitLabCredentials = {
  token: '',
  url: '',
}
export const dummyGitLabCrCredentials: GitLabCrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}
export const dummyGoogleArtifactCrCredentials: GoogleArtifactCrCredentials = {
  password: '',
  registryBase: '',
}
export const dummyHarborCrCredentials: HarborCrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}
export const dummyNexusCrCredentials: NexusCrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}
export const dummyQuayCrCredentials: QuayCrCredentials = {
  username: '',
  password: '',
  registryBase: '',
}

export const dummyCredentials: Record<string, IntegrationCredentials> = {
  acr: dummyAcrCredentials,
  'artifactory-cr': dummyArtifactoryCrCredentials,
  'azure-repos': dummyAzureReposCredentials,
  'bitbucket-server': dummyBitbucketServerCredentials,
  'digitalocean-cr': dummyDigitalOceanCrCredentials,
  'docker-hub': dummyDockerHubCredentials,
  ecr: dummyEcrCredentials,
  gcr: dummyGcrCredentials,
  github: dummyGitHubCredentials,
  'github-cr': dummyGitHubCrCredentials,
  'github-enterprise': dummyGitHubEnterpriseCredentials,
  gitlab: dummyGitLabCredentials,
  'gitlab-cr': dummyGitLabCrCredentials,
  'google-artifact-cr': dummyGoogleArtifactCrCredentials,
  'harbor-cr': dummyHarborCrCredentials,
  'nexus-cr': dummyNexusCrCredentials,
  'quay-cr': dummyQuayCrCredentials,
}
