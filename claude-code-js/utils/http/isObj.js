// function: isObj
function isObj(obj) {
  return obj != null && typeof obj === "object" && !Array.isArray(obj);
}
