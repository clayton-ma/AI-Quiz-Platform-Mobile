/**
 * @file attemptApi.js
 * @description Service layer for quiz attempt-related API interactions, including starting, saving, and retrieving results.
 */
import { API_BASE_URL, getAuthHeader } from "../../../services/authHeader";

/**
 * Fetches a paginated list of attempts for a specific quiz.
 * @async
 * @param {string} quizId - The unique identifier of the quiz.
 * @param {Object} [params={}] - Query parameters.
 * @param {number} [params.page] - Page number for pagination.
 * @param {number} [params.limit] - Number of items per page.
 * @param {string} [params.sort] - Sorting criteria.
 * @param {string} [params.status] - Filter by attempt status (e.g., 'completed', 'in_progress').
 * @returns {Promise<Object>} Object containing attempt data and pagination Link header.
 */
export const fetchAttemptsByQuizId = async (quizId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.sort) query.append("sort", params.sort);
  if (params.status) query.append("status", params.status);

  const response = await fetch(
    `${API_BASE_URL}/attempt/quiz/${quizId}?${query.toString()}`,
    {
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch attempts", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  const linkHeader = response.headers.get("Link") || "";
  return { data, linkHeader };
};

/**
 * Initializes a new attempt for a specific quiz.
 * @async
 * @param {string} quizId - The ID of the quiz to start.
 * @returns {Promise<Object>} The created attempt object.
 */
export const createAttempt = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/attempt/quiz/${quizId}`, {
    method: "POST",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to create attempt", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Fetches details for a specific attempt by its ID.
 * @async
 * @param {string} attemptId - The unique identifier of the attempt.
 * @returns {Promise<Object>} The attempt data.
 */
export const fetchAttemptById = async (attemptId) => {
  const response = await fetch(`${API_BASE_URL}/attempt/${attemptId}`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch attempt", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Updates an attempt (Save progress or Submit for grading).
 * @async
 * @param {string} attemptId - The ID of the attempt to update.
 * @param {Object} attemptData - The updated data.
 * @param {string} attemptData.action - The action to perform ('save' or 'submit').
 * @param {Array<Object>} attemptData.answers - The user's answers.
 * @returns {Promise<Object>} The updated attempt object.
 */
export const updateAttempt = async (attemptId, attemptData) => {
  const response = await fetch(`${API_BASE_URL}/attempt/${attemptId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(attemptData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to update attempt", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Deletes a specific quiz attempt.
 * @async
 * @param {string} attemptId - The ID of the attempt to delete.
 */
export const deleteAttempt = async (attemptId) => {
  const response = await fetch(`${API_BASE_URL}/attempt/${attemptId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to delete attempt", {
      cause: errors.errors || undefined,
    });
  }
};
