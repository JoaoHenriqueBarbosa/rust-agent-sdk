// var: require_NodeList_es6
var require_NodeList_es6 = __commonJS((exports, module) => {
  module.exports = class extends Array {
    constructor(a2) {
      super(a2 && a2.length || 0);
      if (a2)
        for (var idx in a2)
          this[idx] = a2[idx];
    }
    item(i5) {
      return this[i5] || null;
    }
  };
});
