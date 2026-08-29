// class: TreeWalker
class TreeWalker {
  constructor(root2, whatToShow = SHOW_ALL) {
    this.root = root2, this.currentNode = root2, this.whatToShow = whatToShow;
    let { [NEXT]: next, [END]: end } = root2;
    if (root2.nodeType === DOCUMENT_NODE) {
      let { documentElement } = root2;
      next = documentElement, end = documentElement[END];
    }
    let nodes = [];
    while (next && next !== end) {
      if (isOK(next, whatToShow))
        nodes.push(next);
      next = next[NEXT];
    }
    this[PRIVATE] = { i: 0, nodes };
  }
  nextNode() {
    let $3 = this[PRIVATE];
    return this.currentNode = $3.i < $3.nodes.length ? $3.nodes[$3.i++] : null, this.currentNode;
  }
}
