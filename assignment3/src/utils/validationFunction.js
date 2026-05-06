// helper function for data validation

/**
 * Validates if a string is a properly formatted email address.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validates if a password meets security requirements.
 * (Minimum 8 characters, at least one letter and one number).
 * @param {string} password - The password string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isValidPassword(password) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordPattern.test(password);
}

/**
 * Validates if a name contains only letters and spaces, and is within length limits 2-50.
 * @param {string} name - The name string to validate.
 * @returns {boolean} True if valid.
 */
export function isValidName(name) {
  const namePattern = /^[a-zA-Z\s]{2,50}$/;
  return typeof name === "string" && namePattern.test(name.trim());
}
