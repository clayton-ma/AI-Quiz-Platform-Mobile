/**
 * @file authHeader.js
 * @description Utility for managing API base URL and authentication headers.
 */

import * as SecureStore from "expo-secure-store";

/**
 * The base URL for all API requests, sourced from environment variables or defaulting to localhost.
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

/**
 * Generates the Authorization header using the JWT stored in SecureStore.
 * Note: SecureStore.getItem is synchronous in some environments but usually used via state in RN.
 * @returns {Object} An object containing the Authorization header.
 */
export const getAuthHeader = () => {
  const token = SecureStore.getItem("jwt");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};
