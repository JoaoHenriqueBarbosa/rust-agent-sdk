// function: getElementById
function getElementById(id, nodes, recurse = !0) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne(getAttribCheck("id", id), nodes, recurse);
}
