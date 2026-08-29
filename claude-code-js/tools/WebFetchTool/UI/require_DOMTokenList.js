// var: require_DOMTokenList
var require_DOMTokenList = __commonJS((exports, module) => {
  var utils = require_utils12();
  module.exports = DOMTokenList2;
  function DOMTokenList2(getter, setter) {
    this._getString = getter, this._setString = setter, this._length = 0, this._lastStringValue = "", this._update();
  }
  Object.defineProperties(DOMTokenList2.prototype, {
    length: { get: function() {
      return this._length;
    } },
    item: { value: function(index) {
      var list2 = getList(this);
      if (index < 0 || index >= list2.length)
        return null;
      return list2[index];
    } },
    contains: { value: function(token) {
      token = String(token);
      var list2 = getList(this);
      return list2.indexOf(token) > -1;
    } },
    add: { value: function() {
      var list2 = getList(this);
      for (var i5 = 0, len = arguments.length;i5 < len; i5++) {
        var token = handleErrors(arguments[i5]);
        if (list2.indexOf(token) < 0)
          list2.push(token);
      }
      this._update(list2);
    } },
    remove: { value: function() {
      var list2 = getList(this);
      for (var i5 = 0, len = arguments.length;i5 < len; i5++) {
        var token = handleErrors(arguments[i5]), index = list2.indexOf(token);
        if (index > -1)
          list2.splice(index, 1);
      }
      this._update(list2);
    } },
    toggle: { value: function(token, force) {
      if (token = handleErrors(token), this.contains(token)) {
        if (force === void 0 || force === !1)
          return this.remove(token), !1;
        return !0;
      } else {
        if (force === void 0 || force === !0)
          return this.add(token), !0;
        return !1;
      }
    } },
    replace: { value: function(token, newToken) {
      if (String(newToken) === "")
        utils.SyntaxError();
      token = handleErrors(token), newToken = handleErrors(newToken);
      var list2 = getList(this), idx = list2.indexOf(token);
      if (idx < 0)
        return !1;
      var idx2 = list2.indexOf(newToken);
      if (idx2 < 0)
        list2[idx] = newToken;
      else if (idx < idx2)
        list2[idx] = newToken, list2.splice(idx2, 1);
      else
        list2.splice(idx, 1);
      return this._update(list2), !0;
    } },
    toString: { value: function() {
      return this._getString();
    } },
    value: {
      get: function() {
        return this._getString();
      },
      set: function(v2) {
        this._setString(v2), this._update();
      }
    },
    _update: { value: function(list2) {
      if (list2)
        fixIndex(this, list2), this._setString(list2.join(" ").trim());
      else
        fixIndex(this, getList(this));
      this._lastStringValue = this._getString();
    } }
  });
  function fixIndex(clist, list2) {
    var oldLength = clist._length, i5;
    clist._length = list2.length;
    for (i5 = 0;i5 < list2.length; i5++)
      clist[i5] = list2[i5];
    for (;i5 < oldLength; i5++)
      clist[i5] = void 0;
  }
  function handleErrors(token) {
    if (token = String(token), token === "")
      utils.SyntaxError();
    if (/[ \t\r\n\f]/.test(token))
      utils.InvalidCharacterError();
    return token;
  }
  function toArray3(clist) {
    var length = clist._length, arr = Array(length);
    for (var i5 = 0;i5 < length; i5++)
      arr[i5] = clist[i5];
    return arr;
  }
  function getList(clist) {
    var strProp = clist._getString();
    if (strProp === clist._lastStringValue)
      return toArray3(clist);
    var str2 = strProp.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
    if (str2 === "")
      return [];
    else {
      var seen = Object.create(null);
      return str2.split(/[ \t\r\n\f]+/g).filter(function(n5) {
        var key3 = "$" + n5;
        if (seen[key3])
          return !1;
        return seen[key3] = !0, !0;
      });
    }
  }
});
