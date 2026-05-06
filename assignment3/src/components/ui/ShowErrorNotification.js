import ShowNotification from "./ShowNotification";

/**
 * A utility function to display Express Validator errors using native Alerts.
 * Adapted for React Native.
 *
 * @param {Object} errors - The error object containing message and cause.
 */
export default function ShowErrorNotification(errors) {
  if (!errors || typeof errors !== "object") return;
  // {
  //    message: string
  //    errors : errors data
  // }

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

const formatValidationPath = (path = "") => {
  if (!path) return "";

  return (
    path
      // split into segments: questions[0].options[1].content
      .split(".")
      .map((segment) => {
        // extract base key + indexes
        const match = segment.match(/^([a-zA-Z_]+)(\[(\d+)\])?$/);

        if (!match) return segment;

        const [, key, , index] = match;

        const prettyKey = capitalize(key);

        // if it has an index -> "Field 1"
        if (index !== undefined) {
          return `${prettyKey} ${Number(index) + 1}`;
        }

        return prettyKey;
      })
      .join(" → ")
  );
};

const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);
