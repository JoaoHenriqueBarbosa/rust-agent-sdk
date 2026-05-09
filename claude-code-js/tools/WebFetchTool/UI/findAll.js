// function: findAll
function findAll(test2, nodes) {
  let result = [], nodeStack = [Array.isArray(nodes) ? nodes : [nodes]], indexStack = [0];
  for (;; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1)
        return result;
      nodeStack.shift(), indexStack.shift();
      continue;
    }
    let elem = nodeStack[0][indexStack[0]++];
    if (isTag2(elem) && test2(elem))
      result.push(elem);
    if (hasChildren(elem) && elem.children.length > 0)
      indexStack.unshift(0), nodeStack.unshift(elem.children);
  }
}
