// function: getElementsByTagName
function getElementsByTagName(tagName, nodes, recurse = !0, limit = 1 / 0) {
  return filter2(Checks.tag_name(tagName), nodes, recurse, limit);
}
