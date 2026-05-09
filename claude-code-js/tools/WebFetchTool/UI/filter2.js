// function: filter2
function filter2(test2, node2, recurse = !0, limit = 1 / 0) {
  return find(test2, Array.isArray(node2) ? node2 : [node2], recurse, limit);
}
