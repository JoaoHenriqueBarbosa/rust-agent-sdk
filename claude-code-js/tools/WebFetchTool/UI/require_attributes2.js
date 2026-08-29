// var: require_attributes2
var require_attributes2 = __commonJS((exports) => {
  var utils = require_utils12();
  exports.property = function(attr) {
    if (Array.isArray(attr.type)) {
      var valid = Object.create(null);
      attr.type.forEach(function(val) {
        valid[val.value || val] = val.alias || val;
      });
      var missingValueDefault = attr.missing;
      if (missingValueDefault === void 0)
        missingValueDefault = null;
      var invalidValueDefault = attr.invalid;
      if (invalidValueDefault === void 0)
        invalidValueDefault = missingValueDefault;
      return {
        get: function() {
          var v2 = this._getattr(attr.name);
          if (v2 === null)
            return missingValueDefault;
          if (v2 = valid[v2.toLowerCase()], v2 !== void 0)
            return v2;
          if (invalidValueDefault !== null)
            return invalidValueDefault;
          return v2;
        },
        set: function(v2) {
          this._setattr(attr.name, v2);
        }
      };
    } else if (attr.type === Boolean)
      return {
        get: function() {
          return this.hasAttribute(attr.name);
        },
        set: function(v2) {
          if (v2)
            this._setattr(attr.name, "");
          else
            this.removeAttribute(attr.name);
        }
      };
    else if (attr.type === Number || attr.type === "long" || attr.type === "unsigned long" || attr.type === "limited unsigned long with fallback")
      return numberPropDesc(attr);
    else if (!attr.type || attr.type === String)
      return {
        get: function() {
          return this._getattr(attr.name) || "";
        },
        set: function(v2) {
          if (attr.treatNullAsEmptyString && v2 === null)
            v2 = "";
          this._setattr(attr.name, v2);
        }
      };
    else if (typeof attr.type === "function")
      return attr.type(attr.name, attr);
    throw Error("Invalid attribute definition");
  };
  function numberPropDesc(a2) {
    var def2;
    if (typeof a2.default === "function")
      def2 = a2.default;
    else if (typeof a2.default === "number")
      def2 = function() {
        return a2.default;
      };
    else
      def2 = function() {
        utils.assert(!1, typeof a2.default);
      };
    var unsigned_long = a2.type === "unsigned long", signed_long = a2.type === "long", unsigned_fallback = a2.type === "limited unsigned long with fallback", min = a2.min, max2 = a2.max, setmin = a2.setmin;
    if (min === void 0) {
      if (unsigned_long)
        min = 0;
      if (signed_long)
        min = -2147483648;
      if (unsigned_fallback)
        min = 1;
    }
    if (max2 === void 0) {
      if (unsigned_long || signed_long || unsigned_fallback)
        max2 = 2147483647;
    }
    return {
      get: function() {
        var v2 = this._getattr(a2.name), n5 = a2.float ? parseFloat(v2) : parseInt(v2, 10);
        if (v2 === null || !isFinite(n5) || min !== void 0 && n5 < min || max2 !== void 0 && n5 > max2)
          return def2.call(this);
        if (unsigned_long || signed_long || unsigned_fallback) {
          if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(v2))
            return def2.call(this);
          n5 = n5 | 0;
        }
        return n5;
      },
      set: function(v2) {
        if (!a2.float)
          v2 = Math.floor(v2);
        if (setmin !== void 0 && v2 < setmin)
          utils.IndexSizeError(a2.name + " set to " + v2);
        if (unsigned_long)
          v2 = v2 < 0 || v2 > 2147483647 ? def2.call(this) : v2 | 0;
        else if (unsigned_fallback)
          v2 = v2 < 1 || v2 > 2147483647 ? def2.call(this) : v2 | 0;
        else if (signed_long)
          v2 = v2 < -2147483648 || v2 > 2147483647 ? def2.call(this) : v2 | 0;
        this._setattr(a2.name, String(v2));
      }
    };
  }
  exports.registerChangeHandler = function(c3, name3, handler4) {
    var p4 = c3.prototype;
    if (!Object.prototype.hasOwnProperty.call(p4, "_attributeChangeHandlers"))
      p4._attributeChangeHandlers = Object.create(p4._attributeChangeHandlers || null);
    p4._attributeChangeHandlers[name3] = handler4;
  };
});
