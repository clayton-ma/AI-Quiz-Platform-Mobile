/**
 * @file auth/api.js
 * @description Service layer for handling user authentication including registration, login, and logout.
 */
import { useAuth } from "../../../app/providers/AuthContext";
import { API_BASE_URL } from "../../../services/authHeader";
import * as SecureStore from "expo-secure-store";

/**
 * Registers a new user with the provided information.
 * @param {Object} userInfo - The user registration data.
 * @param {string} userInfo.email - User's email address.
 * @param {string} userInfo.password - User's password.
 * @param {string} userInfo.firstname - User's first name.
 * @param {string} userInfo.lastname - User's last name.
 * @returns {Promise<void>} Resolves when registration is successful.
 * @throws {Error} If the registration request fails or server returns an error.
 */
export const registerUser = async (userInfo) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  // Call api
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(userInfo),
    });
  } catch (error) {
    throw new Error("Server maintenance, please try again later.");
  } finally {
    clearTimeout(timeoutId);
  }

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Registration failed", {
      cause: errors.errors || undefined,
    });
  }
};

/**
 * Authenticates a user and stores the JWT token in SecureStore.
 * @param {Object} loginInfo - The user login credentials.
 * @param {string} loginInfo.email - User's email address.
 * @param {string} loginInfo.password - User's password.
 * @returns {Promise<void>} Resolves upon successful login and token storage.
 * @throws {Error} If authentication fails or server returns an error.
 */
export const loginUser = async (loginInfo) => {
  // const {}=useAuth();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  // Call api
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(loginInfo),
    });
  } catch (error) {
    throw new Error("Server maintenance, please try again later.");
  } finally {
    clearTimeout(timeoutId);
  }

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Login failed", {
      cause: errors.errors || undefined,
    });
  }

  // Store the token in SecureStore
  const { data } = await response.json();

  await SecureStore.setItemAsync("jwt", data);
};
