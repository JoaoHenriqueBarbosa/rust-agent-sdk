// var: require_ProcessingInstruction
var require_ProcessingInstruction = __commonJS((exports, module) => {
  module.exports = ProcessingInstruction2;
  var Node5 = require_Node2(), CharacterData3 = require_CharacterData();
  function ProcessingInstruction2(doc2, target, data) {
    CharacterData3.call(this), this.nodeType = Node5.PROCESSING_INSTRUCTION_NODE, this.ownerDocument = doc2, this.target = target, this._data = data;
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
  ProcessingInstruction2.prototype = Object.create(CharacterData3.prototype, {
    nodeName: { get: function() {
      return this.target;
    } },
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
      return new ProcessingInstruction2(this.ownerDocument, this.target, this._data);
    } },
    isEqual: { value: function(n5) {
      return this.target === n5.target && this._data === n5._data;
    } }
  });
});
