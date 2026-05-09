// function: isObj2
function isObj2(obj) {
  return obj != null && typeof obj === "object" && !Array.isArray(obj);
}
