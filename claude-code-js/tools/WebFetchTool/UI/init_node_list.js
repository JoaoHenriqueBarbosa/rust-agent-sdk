// var: init_node_list
var init_node_list = __esm(() => {
  NodeList = class NodeList extends Array {
    item(i5) {
      return i5 < this.length ? this[i5] : null;
    }
  };
});
