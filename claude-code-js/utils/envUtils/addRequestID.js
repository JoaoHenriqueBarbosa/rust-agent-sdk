// function: addRequestID
function addRequestID(value, response) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return value;
  return Object.defineProperty(value, "_request_id", {
    value: response.headers.get("request-id"),
    enumerable: !1
  });
}
