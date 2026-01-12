/**
 * Environment Configuration
 *
 * Centralized environment variable management for the frontend.
 * Uses values from .env.* files injected by Vite.
 */
export declare const config: {
    readonly apiUrl: string;
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly environment: string;
};
/**
 * Validate that required environment variables are set
 */
export declare function validateEnvironment(): void;
export default config;
