// function: next
function next(prev, current, isPre) {
  if (prev && prev.parentNode === current || isPre(current))
    return current.nextSibling || current.parentNode;
  return current.firstChild || current.nextSibling || current.parentNode;
}
