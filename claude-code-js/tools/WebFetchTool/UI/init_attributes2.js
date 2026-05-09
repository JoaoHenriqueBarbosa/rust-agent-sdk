// var: init_attributes2
var init_attributes2 = __esm(() => {
  import_boolbase = __toESM(require_boolbase(), 1), reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
  caseInsensitiveAttributes = /* @__PURE__ */ new Set([
    "accept",
    "accept-charset",
    "align",
    "alink",
    "axis",
    "bgcolor",
    "charset",
    "checked",
    "clear",
    "codetype",
    "color",
    "compact",
    "declare",
    "defer",
    "dir",
    "direction",
    "disabled",
    "enctype",
    "face",
    "frame",
    "hreflang",
    "http-equiv",
    "lang",
    "language",
    "link",
    "media",
    "method",
    "multiple",
    "nohref",
    "noresize",
    "noshade",
    "nowrap",
    "readonly",
    "rel",
    "rev",
    "rules",
    "scope",
    "scrolling",
    "selected",
    "shape",
    "target",
    "text",
    "type",
    "valign",
    "valuetype",
    "vlink"
  ]);
  attributeRules = {
    equals(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3 } = data, { value } = data;
      if (shouldIgnoreCase(data, options2))
        return value = value.toLowerCase(), (elem) => {
          let attr = adapter2.getAttributeValue(elem, name3);
          return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
        };
      return (elem) => adapter2.getAttributeValue(elem, name3) === value && next(elem);
    },
    hyphen(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3 } = data, { value } = data, len = value.length;
      if (shouldIgnoreCase(data, options2))
        return value = value.toLowerCase(), function(elem) {
          let attr = adapter2.getAttributeValue(elem, name3);
          return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
        };
      return function(elem) {
        let attr = adapter2.getAttributeValue(elem, name3);
        return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
      };
    },
    element(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3, value } = data;
      if (/\s/.test(value))
        return import_boolbase.default.falseFunc;
      let regex2 = new RegExp(`(?:^|\\s)${escapeRegex2(value)}(?:$|\\s)`, shouldIgnoreCase(data, options2) ? "i" : "");
      return function(elem) {
        let attr = adapter2.getAttributeValue(elem, name3);
        return attr != null && attr.length >= value.length && regex2.test(attr) && next(elem);
      };
    },
    exists(next, { name: name3 }, { adapter: adapter2 }) {
      return (elem) => adapter2.hasAttrib(elem, name3) && next(elem);
    },
    start(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3 } = data, { value } = data, len = value.length;
      if (len === 0)
        return import_boolbase.default.falseFunc;
      if (shouldIgnoreCase(data, options2))
        return value = value.toLowerCase(), (elem) => {
          let attr = adapter2.getAttributeValue(elem, name3);
          return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
        };
      return (elem) => {
        var _a4;
        return !!((_a4 = adapter2.getAttributeValue(elem, name3)) === null || _a4 === void 0 ? void 0 : _a4.startsWith(value)) && next(elem);
      };
    },
    end(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3 } = data, { value } = data, len = -value.length;
      if (len === 0)
        return import_boolbase.default.falseFunc;
      if (shouldIgnoreCase(data, options2))
        return value = value.toLowerCase(), (elem) => {
          var _a4;
          return ((_a4 = adapter2.getAttributeValue(elem, name3)) === null || _a4 === void 0 ? void 0 : _a4.substr(len).toLowerCase()) === value && next(elem);
        };
      return (elem) => {
        var _a4;
        return !!((_a4 = adapter2.getAttributeValue(elem, name3)) === null || _a4 === void 0 ? void 0 : _a4.endsWith(value)) && next(elem);
      };
    },
    any(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3, value } = data;
      if (value === "")
        return import_boolbase.default.falseFunc;
      if (shouldIgnoreCase(data, options2)) {
        let regex2 = new RegExp(escapeRegex2(value), "i");
        return function(elem) {
          let attr = adapter2.getAttributeValue(elem, name3);
          return attr != null && attr.length >= value.length && regex2.test(attr) && next(elem);
        };
      }
      return (elem) => {
        var _a4;
        return !!((_a4 = adapter2.getAttributeValue(elem, name3)) === null || _a4 === void 0 ? void 0 : _a4.includes(value)) && next(elem);
      };
    },
    not(next, data, options2) {
      let { adapter: adapter2 } = options2, { name: name3 } = data, { value } = data;
      if (value === "")
        return (elem) => !!adapter2.getAttributeValue(elem, name3) && next(elem);
      else if (shouldIgnoreCase(data, options2))
        return value = value.toLowerCase(), (elem) => {
          let attr = adapter2.getAttributeValue(elem, name3);
          return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
        };
      return (elem) => adapter2.getAttributeValue(elem, name3) !== value && next(elem);
    }
  };
});
