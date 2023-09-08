/**
 * mp3stack API base URL
 * @constant
 */
export const API_URL = import.meta.env.VITE_API_URL ?? "";

/**
 * The key used to store authentication token in browser cookies
 * @constant
 */
export const AUTH_COOKIE_KEY = "mp3stack_auth";

/**
 * The maximum age of the authentication cookie in seconds
 * @constant
 */
export const AUTH_COOKIE_MAX_AGE = 86400; // 24 hrs
