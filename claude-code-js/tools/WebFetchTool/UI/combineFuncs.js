// function: combineFuncs
function combineFuncs(a2, b) {
  return (elem) => a2(elem) || b(elem);
}
