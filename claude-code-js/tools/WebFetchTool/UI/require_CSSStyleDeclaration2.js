// var: require_CSSStyleDeclaration2
var require_CSSStyleDeclaration2 = __commonJS((exports, module) => {
  var { parse: parse17 } = require_style_parser();
  module.exports = function(elt) {
    let style = new CSSStyleDeclaration2(elt);
    return new Proxy(style, {
      get: function(target, property2) {
        return property2 in target ? target[property2] : target.getPropertyValue(dasherizeProperty(property2));
      },
      has: function(target, key3) {
        return !0;
      },
      set: function(target, property2, value) {
        if (property2 in target)
          target[property2] = value;
        else
          target.setProperty(dasherizeProperty(property2), value ?? void 0);
        return !0;
      }
    });
  };
  function dasherizeProperty(property2) {
    return property2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function CSSStyleDeclaration2(elt) {
    this._element = elt;
  }
  var IMPORTANT_BANG = "!important";
  function parseStyles(value) {
    let result = {
      property: {},
      priority: {}
    };
    if (!value)
      return result;
    let styleValues = parse17(value);
    if (styleValues.length < 2)
      return result;
    for (let i5 = 0;i5 < styleValues.length; i5 += 2) {
      let name3 = styleValues[i5], value2 = styleValues[i5 + 1];
      if (value2.endsWith(IMPORTANT_BANG))
        result.priority[name3] = "important", value2 = value2.slice(0, -IMPORTANT_BANG.length).trim();
      result.property[name3] = value2;
    }
    return result;
  }
  var NO_CHANGE = {};
  CSSStyleDeclaration2.prototype = Object.create(Object.prototype, {
    _parsed: { get: function() {
      if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
        var text2 = this.cssText;
        this._parsedStyles = parseStyles(text2), this._lastParsedText = text2, delete this._names;
      }
      return this._parsedStyles;
    } },
    _serialize: { value: function() {
      var styles5 = this._parsed, s2 = "";
      for (var name3 in styles5.property) {
        if (s2)
          s2 += " ";
        if (s2 += name3 + ": " + styles5.property[name3], styles5.priority[name3])
          s2 += " !" + styles5.priority[name3];
        s2 += ";";
      }
      this.cssText = s2, this._lastParsedText = s2, delete this._names;
    } },
    cssText: {
      get: function() {
        return this._element.getAttribute("style");
      },
      set: function(value) {
        this._element.setAttribute("style", value);
      }
    },
    length: { get: function() {
      if (!this._names)
        this._names = Object.getOwnPropertyNames(this._parsed.property);
      return this._names.length;
    } },
    item: { value: function(n5) {
      if (!this._names)
        this._names = Object.getOwnPropertyNames(this._parsed.property);
      return this._names[n5];
    } },
    getPropertyValue: { value: function(property2) {
      return property2 = property2.toLowerCase(), this._parsed.property[property2] || "";
    } },
    getPropertyPriority: { value: function(property2) {
      return property2 = property2.toLowerCase(), this._parsed.priority[property2] || "";
    } },
    setProperty: { value: function(property2, value, priority) {
      if (property2 = property2.toLowerCase(), value === null || value === void 0)
        value = "";
      if (priority === null || priority === void 0)
        priority = "";
      if (value !== NO_CHANGE)
        value = "" + value;
      if (value = value.trim(), value === "") {
        this.removeProperty(property2);
        return;
      }
      if (priority !== "" && priority !== NO_CHANGE && !/^important$/i.test(priority))
        return;
      var styles5 = this._parsed;
      if (value === NO_CHANGE) {
        if (!styles5.property[property2])
          return;
        if (priority !== "")
          styles5.priority[property2] = "important";
        else
          delete styles5.priority[property2];
      } else {
        if (value.indexOf(";") !== -1)
          return;
        var newprops = parseStyles(property2 + ":" + value);
        if (Object.getOwnPropertyNames(newprops.property).length === 0)
          return;
        if (Object.getOwnPropertyNames(newprops.priority).length !== 0)
          return;
        for (var p4 in newprops.property)
          if (styles5.property[p4] = newprops.property[p4], priority === NO_CHANGE)
            continue;
          else if (priority !== "")
            styles5.priority[p4] = "important";
          else if (styles5.priority[p4])
            delete styles5.priority[p4];
      }
      this._serialize();
    } },
    setPropertyValue: { value: function(property2, value) {
      return this.setProperty(property2, value, NO_CHANGE);
    } },
    setPropertyPriority: { value: function(property2, priority) {
      return this.setProperty(property2, NO_CHANGE, priority);
    } },
    removeProperty: { value: function(property2) {
      property2 = property2.toLowerCase();
      var styles5 = this._parsed;
      if (property2 in styles5.property)
        delete styles5.property[property2], delete styles5.priority[property2], this._serialize();
    } }
  });
});
