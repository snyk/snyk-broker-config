export const getAuthHeader = () => {
  if (!process.env.SNYK_TOKEN) {
    console.error('Missing Snyk Auth token')
    process.exit(2)
  }
  return {Authorization: `token ${process.env.SNYK_TOKEN}`}
}
