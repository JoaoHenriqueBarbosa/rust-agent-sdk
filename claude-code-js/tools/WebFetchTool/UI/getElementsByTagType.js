// function: getElementsByTagType
function getElementsByTagType(type, nodes, recurse = !0, limit = 1 / 0) {
  return filter2(Checks.tag_type(type), nodes, recurse, limit);
}
