/**
 * Parses the HTTP 'Link' header into an object.
 * Used for pagination to extract URLs for 'next', 'prev', 'first', and 'last' relations.
 *
 * @param {string|null} linkHeader - The raw Link header string from the API response.
 * @returns {Object} An object where keys are the 'rel' attributes and values are the URLs.
 */
export default function parseLinkHeader(linkHeader) {
  // Return empty object if linkHeader does not exist
  if (!linkHeader) {
    return {};
  }

  const links = {};
  // Split multiple links separated by commas
  linkHeader.split(",").forEach((link) => {
    // Regex to capture the URL inside <> and the rel attribute inside ""
    const match = link.match(/<([^>]+)>; rel="([^"]+)"/);
    if (match) {
      const [, url, rel] = match;
      links[rel] = url;
    }
  });

  return links;
}
