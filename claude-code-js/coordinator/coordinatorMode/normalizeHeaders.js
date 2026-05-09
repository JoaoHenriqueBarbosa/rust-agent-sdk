// function: normalizeHeaders
function normalizeHeaders(headers) {
  if (!headers)
    return {};
  if (headers instanceof Headers)
    return Object.fromEntries(headers.entries());
  if (Array.isArray(headers))
    return Object.fromEntries(headers);
  return { ...headers };
}
