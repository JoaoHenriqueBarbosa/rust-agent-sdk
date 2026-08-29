// var: require_LinkedList
var require_LinkedList = __commonJS((exports, module) => {
  var utils = require_utils12(), LinkedList = module.exports = {
    valid: function(a2) {
      return utils.assert(a2, "list falsy"), utils.assert(a2._previousSibling, "previous falsy"), utils.assert(a2._nextSibling, "next falsy"), !0;
    },
    insertBefore: function(a2, b) {
      utils.assert(LinkedList.valid(a2) && LinkedList.valid(b));
      var a_first = a2, a_last = a2._previousSibling, b_first = b, b_last = b._previousSibling;
      a_first._previousSibling = b_last, a_last._nextSibling = b_first, b_last._nextSibling = a_first, b_first._previousSibling = a_last, utils.assert(LinkedList.valid(a2) && LinkedList.valid(b));
    },
    replace: function(a2, b) {
      if (utils.assert(LinkedList.valid(a2) && (b === null || LinkedList.valid(b))), b !== null)
        LinkedList.insertBefore(b, a2);
      LinkedList.remove(a2), utils.assert(LinkedList.valid(a2) && (b === null || LinkedList.valid(b)));
    },
    remove: function(a2) {
      utils.assert(LinkedList.valid(a2));
      var prev = a2._previousSibling;
      if (prev === a2)
        return;
      var next = a2._nextSibling;
      prev._nextSibling = next, next._previousSibling = prev, a2._previousSibling = a2._nextSibling = a2, utils.assert(LinkedList.valid(a2));
    }
  };
});
