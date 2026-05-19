import { API_BASE_URL, getAuthHeader } from "../../../services/authHeader";
import parseLinkHeader from "../../../utils/parseLinkHeader";

/**
 * Fetches all groups available to the current user.
 * @async
 * @returns {Promise<Array>} A promise that resolves to the list of groups.
 */
export const fetchGroups = async (params = {}) => {
  // Build query string
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  if (params.sort) query.append("sort", params.sort);

  // Call api
  const response = await fetch(`${API_BASE_URL}/group?${query.toString()}`, {
    headers: getAuthHeader(),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch groups", {
      cause: errors.errors || undefined,
    });
  }

  // Return the data
  const json = await response.json();
  const data = json.data;
  const linkHeader = parseLinkHeader(response.headers.get("Link")) || "";
  return { data, linkHeader };
};

/**
 * Fetches details for a specific group by its ID.
 * @async
 * @param {string|number} groupId - The unique identifier of the group.
 * @returns {Promise<Object>} The group data.
 */
export const fetchGroupById = async (groupId) => {
  // Call api
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    headers: getAuthHeader(),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch group", {
      cause: errors.errors || undefined,
    });
  }

  // Return the data
  const { data } = await response.json();
  return data;
};

/**
 * Creates a new group.
 * @async
 * @param {Object} groupData - The data for the new group (e.g., name, description).
 * @returns {Promise<Object>} The created group object.
 */
export const createGroup = async (groupData) => {
  // Call api
  const response = await fetch(`${API_BASE_URL}/group`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to create group", {
      cause: errors.errors || undefined,
    });
  }

  // Return the data
  const { data } = await response.json();
  return data;
};

/**
 * Updates an existing group's information.
 * @async
 * @param {string|number} groupId - The ID of the group to update.
 * @param {Object} groupData - The updated data fields.
 * @returns {Promise<Object>} The updated group object.
 */
export const updateGroup = async (groupId, groupData) => {
  // Call api
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to update group", {
      cause: errors.errors || undefined,
    });
  }

  // Return the data
  const { data } = await response.json();
  return data;
};

/**
 * Deletes a group.
 * @async
 * @param {string|number} groupId - The ID of the group to delete.
 */
export const deleteGroup = async (groupId) => {
  // Call api
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to delete group", {
      cause: errors.errors || undefined,
    });
  }
};
