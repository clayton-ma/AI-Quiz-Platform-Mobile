/**
 * @file authHeader.js
 * @description Utility for managing API base URL and authentication headers.
 */

import * as SecureStore from "expo-secure-store";

/**
 * The base URL for all API requests, sourced from environment variables or defaulting to localhost.
 */
export const API_BASE_URL = "http://localhost:1989/api";

/**
 * Generates the Authorization header using the JWT stored in SecureStore.
 * Note: SecureStore.getItem is synchronous in some environments but usually used via state in RN.
 * @returns {Object} An object containing the Authorization header.
 */
export const getAuthHeader = () => ({
  Authorization: `Bearer ${SecureStore.getItemSync("jwt")}`,
});
