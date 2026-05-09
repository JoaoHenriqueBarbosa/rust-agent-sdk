// function: fetch2
function fetch2(tagName, where, recurse = !1) {
  return textContent(getElementsByTagName(tagName, where, recurse, 1)).trim();
}
