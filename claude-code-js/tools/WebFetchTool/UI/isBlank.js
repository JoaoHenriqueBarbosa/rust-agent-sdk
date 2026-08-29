// function: isBlank
function isBlank(node2) {
  return !isVoid2(node2) && !isMeaningfulWhenBlank(node2) && /^\s*$/i.test(node2.textContent) && !hasVoid(node2) && !hasMeaningfulWhenBlank(node2);
}
