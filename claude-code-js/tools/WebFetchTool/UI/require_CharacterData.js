// var: require_CharacterData
var require_CharacterData = __commonJS((exports, module) => {
  module.exports = CharacterData3;
  var Leaf = require_Leaf(), utils = require_utils12(), ChildNode = require_ChildNode(), NonDocumentTypeChildNode = require_NonDocumentTypeChildNode();
  function CharacterData3() {
    Leaf.call(this);
  }
  CharacterData3.prototype = Object.create(Leaf.prototype, {
    substringData: { value: function(offset, count3) {
      if (arguments.length < 2)
        throw TypeError("Not enough arguments");
      if (offset = offset >>> 0, count3 = count3 >>> 0, offset > this.data.length || offset < 0 || count3 < 0)
        utils.IndexSizeError();
      return this.data.substring(offset, offset + count3);
    } },
    appendData: { value: function(data) {
      if (arguments.length < 1)
        throw TypeError("Not enough arguments");
      this.data += String(data);
    } },
    insertData: { value: function(offset, data) {
      return this.replaceData(offset, 0, data);
    } },
    deleteData: { value: function(offset, count3) {
      return this.replaceData(offset, count3, "");
    } },
    replaceData: { value: function(offset, count3, data) {
      var curtext = this.data, len = curtext.length;
      if (offset = offset >>> 0, count3 = count3 >>> 0, data = String(data), offset > len || offset < 0)
        utils.IndexSizeError();
      if (offset + count3 > len)
        count3 = len - offset;
      var prefix = curtext.substring(0, offset), suffix = curtext.substring(offset + count3);
      this.data = prefix + data + suffix;
    } },
    isEqual: { value: function(n5) {
      return this._data === n5._data;
    } },
    length: { get: function() {
      return this.data.length;
    } }
  });
  Object.defineProperties(CharacterData3.prototype, ChildNode);
  Object.defineProperties(CharacterData3.prototype, NonDocumentTypeChildNode);
});
