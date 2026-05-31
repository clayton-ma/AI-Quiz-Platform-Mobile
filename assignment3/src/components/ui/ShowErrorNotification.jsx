/**
 * @file ShowErrorNotification.jsx
 * @description Utility for parsing and displaying backend validation and system errors.
 */
import ShowNotification from "./ShowNotification";

/**
 * ShowErrorNotification
 *
 * Processes error objects (typically from API responses) and displays them
 * using the system-wide notification utility. It handles both generic
 * error messages and structured Express Validator error arrays.
 *
 * @param {Object} errors - The error object containing message and cause.
 * @param {string} [errors.message] - General error description.
 * @param {Array|Object} [errors.cause] - Detailed validation errors or error cause.
 */
export default function ShowErrorNotification(errors) {
  if (!errors || typeof errors !== "object") return;
  const { message, cause } = errors;

  // Handle single error message without a cause array
  if (!cause) {
    ShowNotification({
      id: `val-err-single-${Date.now()}`,
      title: "Error",
      message: message || "An unexpected error occurred",
      type: "error",
    });
    return;
  }

  // Handle Express Validator error array format: [{ msg: "...", path: "..." }, ...]
  if (Array.isArray(cause) && cause.length > 0) {
    const errorMessage = formatExpressValidatorErrors(cause);

    ShowNotification({
      id: `val-err-list-${Date.now()}`,
      title: "Validation Error",
      message: errorMessage.replace(/\n/g, "   ||   "),
      type: "error",
    });
  }
}

/**
 * Formats an array of Express Validator errors into a readable string.
 *
 * @param {Array} cause - Array of error objects from the backend.
 * @returns {string} Formatted error string.
 */
const formatExpressValidatorErrors = (cause = []) => {
  if (!Array.isArray(cause)) return "";

  return cause
    .map((err) => {
      const path = formatValidationPath(err.path);
      const msg = err.msg || "Invalid value";
      return `${path}: ${msg}`;
    })
    .join("\n");
};

/**
 * Converts technical validation paths into user-friendly breadcrumbs.
 * Example: "questions[0].content" -> "Questions 1 → Content"
 *
 * @param {string} path - The raw field path from the validator.
 * @returns {string} Pretty-printed path.
 */
const formatValidationPath = (path = "") => {
  if (!path) return "";

  return path
    .split(".")
    .map((segment) => {
      // extract base key + indexes
      const match = segment.match(/^([a-zA-Z_]+)(\[(\d+)\])?$/);

      if (!match) return segment;

      const [, key, , index] = match;

      const prettyKey = capitalize(key);

      if (index !== undefined) {
        return `${prettyKey} ${Number(index) + 1}`;
      }

      return prettyKey;
    })
    .join(" → ");
};

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);
