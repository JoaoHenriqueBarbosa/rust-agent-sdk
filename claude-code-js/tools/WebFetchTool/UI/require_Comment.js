// var: require_Comment
var require_Comment = __commonJS((exports, module) => {
  module.exports = Comment5;
  var Node5 = require_Node2(), CharacterData3 = require_CharacterData();
  function Comment5(doc2, data) {
    CharacterData3.call(this), this.nodeType = Node5.COMMENT_NODE, this.ownerDocument = doc2, this._data = data;
  }
  var nodeValue = {
    get: function() {
      return this._data;
    },
    set: function(v2) {
      if (v2 === null || v2 === void 0)
        v2 = "";
      else
        v2 = String(v2);
      if (this._data = v2, this.rooted)
        this.ownerDocument.mutateValue(this);
    }
  };
  Comment5.prototype = Object.create(CharacterData3.prototype, {
    nodeName: { value: "#comment" },
    nodeValue,
    textContent: nodeValue,
    innerText: nodeValue,
    data: {
      get: nodeValue.get,
      set: function(v2) {
        nodeValue.set.call(this, v2 === null ? "" : String(v2));
      }
    },
    clone: { value: function() {
      return new Comment5(this.ownerDocument, this._data);
    } }
  });
});
