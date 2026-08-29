// class: DomHandler
class DomHandler {
  constructor(callback, options2, elementCB) {
    if (this.dom = [], this.root = new Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null, typeof options2 === "function")
      elementCB = options2, options2 = defaultOpts;
    if (typeof callback === "object")
      options2 = callback, callback = void 0;
    this.callback = callback !== null && callback !== void 0 ? callback : null, this.options = options2 !== null && options2 !== void 0 ? options2 : defaultOpts, this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser2) {
    this.parser = parser2;
  }
  onreset() {
    this.dom = [], this.root = new Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null;
  }
  onend() {
    if (this.done)
      return;
    this.done = !0, this.parser = null, this.handleCallback(null);
  }
  onerror(error44) {
    this.handleCallback(error44);
  }
  onclosetag() {
    this.lastNode = null;
    let elem = this.tagStack.pop();
    if (this.options.withEndIndices)
      elem.endIndex = this.parser.endIndex;
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name3, attribs) {
    let type = this.options.xmlMode ? ElementType.Tag : void 0, element = new Element(name3, attribs, void 0, type);
    this.addNode(element), this.tagStack.push(element);
  }
  ontext(data) {
    let { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      if (lastNode.data += data, this.options.withEndIndices)
        lastNode.endIndex = this.parser.endIndex;
    } else {
      let node2 = new Text4(data);
      this.addNode(node2), this.lastNode = node2;
    }
  }
  oncomment(data) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data;
      return;
    }
    let node2 = new Comment2(data);
    this.addNode(node2), this.lastNode = node2;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    let text2 = new Text4(""), node2 = new CDATA2([text2]);
    this.addNode(node2), text2.parent = node2, this.lastNode = text2;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name3, data) {
    let node2 = new ProcessingInstruction(name3, data);
    this.addNode(node2);
  }
  handleCallback(error44) {
    if (typeof this.callback === "function")
      this.callback(error44, this.dom);
    else if (error44)
      throw error44;
  }
  addNode(node2) {
    let parent2 = this.tagStack[this.tagStack.length - 1], previousSibling = parent2.children[parent2.children.length - 1];
    if (this.options.withStartIndices)
      node2.startIndex = this.parser.startIndex;
    if (this.options.withEndIndices)
      node2.endIndex = this.parser.endIndex;
    if (parent2.children.push(node2), previousSibling)
      node2.prev = previousSibling, previousSibling.next = node2;
    node2.parent = parent2, this.lastNode = null;
  }
}
