// var: require_FilteredElementList
var require_FilteredElementList = __commonJS((exports, module) => {
  module.exports = FilteredElementList;
  var Node5 = require_Node2();
  function FilteredElementList(root2, filter3) {
    this.root = root2, this.filter = filter3, this.lastModTime = root2.lastModTime, this.done = !1, this.cache = [], this.traverse();
  }
  FilteredElementList.prototype = Object.create(Object.prototype, {
    length: { get: function() {
      if (this.checkcache(), !this.done)
        this.traverse();
      return this.cache.length;
    } },
    item: { value: function(n5) {
      if (this.checkcache(), !this.done && n5 >= this.cache.length)
        this.traverse();
      return this.cache[n5];
    } },
    checkcache: { value: function() {
      if (this.lastModTime !== this.root.lastModTime) {
        for (var i5 = this.cache.length - 1;i5 >= 0; i5--)
          this[i5] = void 0;
        this.cache.length = 0, this.done = !1, this.lastModTime = this.root.lastModTime;
      }
    } },
    traverse: { value: function(n5) {
      if (n5 !== void 0)
        n5++;
      var elt;
      while ((elt = this.next()) !== null)
        if (this[this.cache.length] = elt, this.cache.push(elt), n5 && this.cache.length === n5)
          return;
      this.done = !0;
    } },
    next: { value: function() {
      var start = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1], elt;
      if (start.nodeType === Node5.DOCUMENT_NODE)
        elt = start.documentElement;
      else
        elt = start.nextElement(this.root);
      while (elt) {
        if (this.filter(elt))
          return elt;
        elt = elt.nextElement(this.root);
      }
      return null;
    } }
  });
});
