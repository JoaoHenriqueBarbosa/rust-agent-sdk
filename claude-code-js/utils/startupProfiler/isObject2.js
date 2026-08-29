// function: isObject2
function isObject2(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
