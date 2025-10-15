// Hardcode values for Netlify - yeh public values hain
export const apiVersion = '2025-09-18'
export const dataset = 'production' // ✅ Hardcoded
export const projectId = 'rdz6i146' // ✅ Hardcoded

// Use SANITY_API_TOKEN if SANITY_WRITE_CLIENT is not available
export const token = process.env.SANITY_WRITE_CLIENT || process.env.SANITY_API_TOKEN;

// Remove assertValue function - not needed anymore