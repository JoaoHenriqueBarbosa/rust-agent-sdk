// var: init_named_node_map
var init_named_node_map = __esm(() => {
  NamedNodeMap = class NamedNodeMap extends Array {
    constructor(ownerElement) {
      super();
      this.ownerElement = ownerElement;
    }
    getNamedItem(name3) {
      return this.ownerElement.getAttributeNode(name3);
    }
    setNamedItem(attr) {
      this.ownerElement.setAttributeNode(attr), this.unshift(attr);
    }
    removeNamedItem(name3) {
      let item = this.getNamedItem(name3);
      this.ownerElement.removeAttribute(name3), this.splice(this.indexOf(item), 1);
    }
    item(index) {
      return index < this.length ? this[index] : null;
    }
    getNamedItemNS(_, name3) {
      return this.getNamedItem(name3);
    }
    setNamedItemNS(_, attr) {
      return this.setNamedItem(attr);
    }
    removeNamedItemNS(_, name3) {
      return this.removeNamedItem(name3);
    }
  };
});
