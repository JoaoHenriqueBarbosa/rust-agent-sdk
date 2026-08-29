// var: require_NodeList_es5
var require_NodeList_es5 = __commonJS((exports, module) => {
  function item(i5) {
    return this[i5] || null;
  }
  function NodeList2(a2) {
    if (!a2)
      a2 = [];
    return a2.item = item, a2;
  }
  module.exports = NodeList2;
});
