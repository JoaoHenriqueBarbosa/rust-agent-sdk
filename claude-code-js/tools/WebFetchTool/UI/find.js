// function: find
function find(test2, nodes, recurse, limit) {
  let result = [], nodeStack = [Array.isArray(nodes) ? nodes : [nodes]], indexStack = [0];
  for (;; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1)
        return result;
      nodeStack.shift(), indexStack.shift();
      continue;
    }
    let elem = nodeStack[0][indexStack[0]++];
    if (test2(elem)) {
      if (result.push(elem), --limit <= 0)
        return result;
    }
    if (recurse && hasChildren(elem) && elem.children.length > 0)
      indexStack.unshift(0), nodeStack.unshift(elem.children);
  }
}
