// function: getElements
function getElements(options2, nodes, recurse, limit = 1 / 0) {
  let test2 = compileTest(options2);
  return test2 ? filter2(test2, nodes, recurse, limit) : [];
}
