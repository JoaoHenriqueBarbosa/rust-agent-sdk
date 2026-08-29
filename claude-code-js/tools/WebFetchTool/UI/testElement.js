// function: testElement
function testElement(options2, node2) {
  let test2 = compileTest(options2);
  return test2 ? test2(node2) : !0;
}
