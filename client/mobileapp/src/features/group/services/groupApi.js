/**
 * @file groupApi.js
 * @description Service layer for group-related API interactions, including CRUD operations and group management.
 */
import { API_BASE_URL, getAuthHeader } from "../../../services/authHeader";
import parseLinkHeader from "../../../utils/parseLinkHeader";

/**
 * Fetches a paginated list of groups available to the current user with optional filters.
 * @async
 * @param {Object} [params={}] - Query parameters.
 * @param {number} [params.page] - Page number for pagination.
 * @param {number} [params.limit] - Number of items per page.
 * @param {string} [params.search] - Search term for group names.
 * @param {string} [params.role] - Filter by user role in the group (e.g., 'admin').
 * @param {string} [params.sort] - Sorting criteria.
 * @returns {Promise<Object>} Object containing the array of groups and parsed pagination links.
 */
export const fetchGroups = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  if (params.sort) query.append("sort", params.sort);

  const response = await fetch(`${API_BASE_URL}/group?${query.toString()}`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch groups", {
      cause: errors.errors || undefined,
    });
  }

  const json = await response.json();
  const data = json.data;
  const linkHeader = parseLinkHeader(response.headers.get("Link")) || "";
  return { data, linkHeader };
};

/**
 * Fetches details for a specific group by its ID.
 * @async
 * @param {string} groupId - The unique identifier of the group.
 * @returns {Promise<Object>} The group data.
 */
export const fetchGroupById = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch group", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Creates a new group.
 * @async
 * @param {Object} groupData - The group configuration.
 * @param {string} groupData.name - The name of the group.
 * @param {string} [groupData.description] - Optional description.
 * @returns {Promise<Object>} The created group object.
 */
export const createGroup = async (groupData) => {
  const response = await fetch(`${API_BASE_URL}/group`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to create group", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Updates an existing group's information.
 * @async
 * @param {string} groupId - The ID of the group to update.
 * @param {Object} groupData - The updated data fields.
 * @returns {Promise<Object>} The updated group object.
 */
export const updateGroup = async (groupId, groupData) => {
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to update group", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Deletes a group and removes associated memberships.
 * @async
 * @param {string} groupId - The ID of the group to delete.
 */
export const deleteGroup = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/group/${groupId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to delete group", {
      cause: errors.errors || undefined,
    });
  }
};
