// function: isOperatorObject
function isOperatorObject(obj) {
  let keys3 = Object.keys(obj);
  return keys3.length > 0 && keys3.filter((k3) => k3[0] === "$").length === keys3.length;
}
