// class: Range
class Range {
  constructor() {
    this[START] = null, this[END] = null, this.commonAncestorContainer = null;
  }
  insertNode(newNode) {
    this[END].parentNode.insertBefore(newNode, this[START]);
  }
  selectNode(node2) {
    this[START] = node2, this[END] = getEnd(node2);
  }
  selectNodeContents(node2) {
    this.selectNode(node2), this.commonAncestorContainer = node2;
  }
  surroundContents(parentNode) {
    parentNode.replaceChildren(this.extractContents());
  }
  setStartBefore(node2) {
    this[START] = node2;
  }
  setStartAfter(node2) {
    this[START] = node2.nextSibling;
  }
  setEndBefore(node2) {
    this[END] = getEnd(node2.previousSibling);
  }
  setEndAfter(node2) {
    this[END] = getEnd(node2);
  }
  cloneContents() {
    let { [START]: start, [END]: end } = this, fragment = start.ownerDocument.createDocumentFragment();
    while (start !== end)
      if (fragment.insertBefore(start.cloneNode(!0), fragment[END]), start = getEnd(start), start !== end)
        start = start[NEXT];
    return fragment;
  }
  deleteContents() {
    deleteContents(this);
  }
  extractContents() {
    let fragment = this[START].ownerDocument.createDocumentFragment();
    return deleteContents(this, fragment), fragment;
  }
  createContextualFragment(html2) {
    let { commonAncestorContainer: doc2 } = this, isSVG = "ownerSVGElement" in doc2, document2 = isSVG ? doc2.ownerDocument : doc2, content = htmlToFragment(document2, html2);
    if (isSVG) {
      let childNodes = [...content.childNodes];
      content = document2.createDocumentFragment(), Object.setPrototypeOf(content, SVGElement.prototype), content.ownerSVGElement = document2;
      for (let child of childNodes)
        Object.setPrototypeOf(child, SVGElement.prototype), child.ownerSVGElement = document2, content.appendChild(child);
    } else
      this.selectNode(content);
    return content;
  }
  cloneRange() {
    let range = new Range;
    return range[START] = this[START], range[END] = this[END], range;
  }
}
