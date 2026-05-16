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
export const getAuthHeader = () => ({
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmEwNTVjZjk2ZTAyNjQyZmRlOWE2MTgxIiwiaWF0IjoxNzc4NzM2NDY3LCJleHAiOjE3Nzg3NDM2Njd9.fPuYoF74TQzo5eXFjm3iRZp_EKUR7Q8PxVcCcEOdSiM`,
  // Authorization: `Bearer ${SecureStore.getItemSync("jwt")}`,
});
