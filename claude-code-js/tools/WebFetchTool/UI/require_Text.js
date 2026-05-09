// var: require_Text
var require_Text = __commonJS((exports, module) => {
  module.exports = Text7;
  var utils = require_utils12(), Node5 = require_Node2(), CharacterData3 = require_CharacterData();
  function Text7(doc2, data) {
    CharacterData3.call(this), this.nodeType = Node5.TEXT_NODE, this.ownerDocument = doc2, this._data = data, this._index = void 0;
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
      if (v2 === this._data)
        return;
      if (this._data = v2, this.rooted)
        this.ownerDocument.mutateValue(this);
      if (this.parentNode && this.parentNode._textchangehook)
        this.parentNode._textchangehook(this);
    }
  };
  Text7.prototype = Object.create(CharacterData3.prototype, {
    nodeName: { value: "#text" },
    nodeValue,
    textContent: nodeValue,
    innerText: nodeValue,
    data: {
      get: nodeValue.get,
      set: function(v2) {
        nodeValue.set.call(this, v2 === null ? "" : String(v2));
      }
    },
    splitText: { value: function(offset) {
      if (offset > this._data.length || offset < 0)
        utils.IndexSizeError();
      var newdata = this._data.substring(offset), newnode = this.ownerDocument.createTextNode(newdata);
      this.data = this.data.substring(0, offset);
      var parent2 = this.parentNode;
      if (parent2 !== null)
        parent2.insertBefore(newnode, this.nextSibling);
      return newnode;
    } },
    wholeText: { get: function() {
      var result = this.textContent;
      for (var next = this.nextSibling;next; next = next.nextSibling) {
        if (next.nodeType !== Node5.TEXT_NODE)
          break;
        result += next.textContent;
      }
      return result;
    } },
    replaceWholeText: { value: utils.nyi },
    clone: { value: function() {
      return new Text7(this.ownerDocument, this._data);
    } }
  });
});
