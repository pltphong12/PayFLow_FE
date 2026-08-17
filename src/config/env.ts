/**
 * Environment configuration for PayFlow Frontend.
 * Centralizes all environment variables with type safety and fallback defaults.
 */

export const env = {
    /**
     * Base URL for Backend API Gateway (default: http://localhost:8080/api/v1)
     */
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',

    /**
     * Application Name
     */
    appName: import.meta.env.VITE_APP_NAME || 'PayFlow',

    /**
     * Current Environment (development | production | test)
     */
    appEnv: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development',

    /**
     * Helper boolean to check if in development mode
     */
    isDev: import.meta.env.DEV,

    /**
     * Helper boolean to check if in production mode
     */
    isProd: import.meta.env.PROD,
} as const;

export default env;
