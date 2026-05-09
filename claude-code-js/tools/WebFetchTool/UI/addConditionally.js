// function: addConditionally
function addConditionally(obj, prop, tagName, where, recurse = !1) {
  let val = fetch2(tagName, where, recurse);
  if (val)
    obj[prop] = val;
}
