// function: getElementsByClassName
function getElementsByClassName(className, nodes, recurse = !0, limit = 1 / 0) {
  return filter2(getAttribCheck("class", className), nodes, recurse, limit);
}
