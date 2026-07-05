/**
 * @file quizApi.js
 * @description Service layer for quiz-related API interactions, including CRUD operations, AI generation, and result management.
 */
import { API_BASE_URL, getAuthHeader } from "../../../services/authHeader";

/**
 * Fetches a paginated list of quizzes based on user visibility and filters.
 * @async
 * @param {Object} params - Query parameters (page, limit, search, sort).
 * @returns {Promise<Object>} Object containing quiz data and pagination Link header.
 */
export const fetchQuizzes = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.search) query.append("search", params.search);
  if (params.sort) query.append("sort", params.sort);

  const response = await fetch(`${API_BASE_URL}/quiz?${query.toString()}`, {
    headers: getAuthHeader(),
  });

  // Error handling
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch quizzes", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  const linkHeader = response.headers.get("Link") || "";
  return { data, linkHeader };
};

/**
 * Fetches full quiz details (questions and options) by ID.
 * @async
 * @param {string} quizId - The unique identifier of the quiz.
 * @returns {Promise<Object>} The quiz data.
 */
export const fetchQuizById = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch quiz", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Fetches lean quiz metadata (excluding questions) by ID.
 * @async
 * @param {string} quizId - The unique identifier of the quiz.
 * @returns {Promise<Object>} The quiz metadata.
 */
export const fetchQuizMetadata = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/metadata/${quizId}`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch quiz", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Fetches full quiz details including sensitive fields (is_correct) for editing.
 * @async
 * @param {string} quizId - The unique identifier of the quiz.
 * @returns {Promise<Object>} The full quiz data for admin use.
 */
export const fetchQuizByIdForEdit = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/edit`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to fetch quiz", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Creates a new quiz.
 * @async
 * @param {Object} quizData - The quiz configuration (name, groupIds, etc.).
 * @returns {Promise<Object>} The created quiz object.
 */
export const createQuiz = async (quizData) => {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to create quiz", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Updates an existing quiz's metadata or question structure.
 * @async
 * @param {string} quizId - The ID of the quiz to update.
 * @param {Object} quizData - The updated data fields.
 * @returns {Promise<Object>} The updated quiz object.
 */
export const updateQuiz = async (quizId, quizData) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to update quiz", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Deletes a quiz and its associated questions/options.
 * @async
 * @param {string} quizId - The ID of the quiz to delete.
 */
export const deleteQuiz = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to delete quiz", {
      cause: errors.errors || undefined,
    });
  }
};

/**
 * Generates quiz questions using AI based on a specific topic.
 * @async
 * @param {string} topic - The subject for the quiz.
 * @param {number} numQuestions - Number of questions to generate.
 * @returns {Promise<Array>} Array of generated question objects.
 */
export const generateQuestions = async (topic, numQuestions) => {
  const response = await fetch(`${API_BASE_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ topic, question_count: numQuestions }),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to generate questions", {
      cause: errors.errors || undefined,
    });
  }

  const { data } = await response.json();
  return data;
};

/**
 * Transitions a quiz from 'draft' to 'published' status.
 * @async
 * @param {string} quizId - The ID of the quiz to publish.
 * @returns {Promise<string>} Success message.
 */
export const publishQuiz = async (quizId) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/publish`, {
    method: "PUT",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to publish quiz", {
      cause: errors.errors || undefined,
    });
  }
};

/**
 * Toggles the instant result visibility for a specific quiz.
 * @async
 * @param {Object} payload - The payload object.
 * @param {string} payload.quizId - The ID of the quiz.
 * @param {boolean} payload.instant_result - Whether results should be shown instantly.
 */
export const toggleInstantResult = async ({ quizId, instant_result }) => {
  const response = await fetch(
    `${API_BASE_URL}/quiz/${quizId}/toggle-release-results`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ instant_result }),
    },
  );

  if (!response.ok) {
    const errors = await response.json();
    throw new Error(errors.message || "Failed to release quiz results", {
      cause: errors.errors || undefined,
    });
  }
};
