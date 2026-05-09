// function: isPlainObject6
function isPlainObject6(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
