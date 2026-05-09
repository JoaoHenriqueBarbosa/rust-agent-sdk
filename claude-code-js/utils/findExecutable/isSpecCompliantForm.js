// function: isSpecCompliantForm
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction2(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
