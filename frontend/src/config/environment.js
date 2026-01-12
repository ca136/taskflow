/**
 * Environment Configuration
 *
 * Centralized environment variable management for the frontend.
 * Uses values from .env.* files injected by Vite.
 */
export const config = {
    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    // Environment Detection
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    environment: import.meta.env.MODE,
};
/**
 * Validate that required environment variables are set
 */
export function validateEnvironment() {
    const required = ['apiUrl'];
    const missing = [];
    for (const key of required) {
        if (!config[key]) {
            missing.push(key);
        }
    }
    if (missing.length > 0) {
        console.warn(`Missing environment variables: ${missing.join(', ')}`);
    }
}
export default config;
