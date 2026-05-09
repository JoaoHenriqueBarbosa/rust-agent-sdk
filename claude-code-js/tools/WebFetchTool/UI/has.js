// function: has
function has(node2, tagNames) {
  return node2.getElementsByTagName && tagNames.some(function(tagName19) {
    return node2.getElementsByTagName(tagName19).length;
  });
}
