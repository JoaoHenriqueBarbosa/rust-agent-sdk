// function: remove3
function remove3(node2) {
  var next = node2.nextSibling || node2.parentNode;
  return node2.parentNode.removeChild(node2), next;
}
