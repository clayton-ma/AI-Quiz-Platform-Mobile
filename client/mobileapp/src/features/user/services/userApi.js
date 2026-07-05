import { API_BASE_URL, getAuthHeader } from "../../../services/authHeader";

/**
 * Fetches the profile data of the currently authenticated user.
 * @returns {Promise<Object>} The user profile object.
 * @throws {Error} If the request fails.
 */
export const fetchUser = async () => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch user", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Updates the current user's profile information.
 * @param {Object} userData - The updated user fields.
 * @param {string} [userData.firstname] - The user's first name.
 * @param {string} [userData.lastname] - The user's last name.
 * @returns {Promise<Object>} The updated user object.
 * @throws {Error} If the update fails.
 */
export const updateUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to update user", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};
