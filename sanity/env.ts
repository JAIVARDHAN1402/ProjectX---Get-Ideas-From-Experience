// Hardcode values for Netlify - yeh public values hain
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rdz6i146'
// Use SANITY_API_TOKEN if SANITY_WRITE_CLIENT is not available
export const token = process.env.SANITY_WRITE_CLIENT || process.env.SANITY_API_TOKEN;

