// var: init_filters
var init_filters = __esm(() => {
  init_esm32();
  import_boolbase3 = __toESM(require_boolbase(), 1);
  filters = {
    contains(next, text2, { adapter: adapter2 }) {
      return function(elem) {
        return next(elem) && adapter2.getText(elem).includes(text2);
      };
    },
    icontains(next, text2, { adapter: adapter2 }) {
      let itext = text2.toLowerCase();
      return function(elem) {
        return next(elem) && adapter2.getText(elem).toLowerCase().includes(itext);
      };
    },
    "nth-child"(next, rule, { adapter: adapter2, equals: equals2 }) {
      let func = nthCheck(rule);
      if (func === import_boolbase3.default.falseFunc)
        return import_boolbase3.default.falseFunc;
      if (func === import_boolbase3.default.trueFunc)
        return getChildFunc(next, adapter2);
      return function(elem) {
        let siblings = adapter2.getSiblings(elem), pos = 0;
        for (let i5 = 0;i5 < siblings.length; i5++) {
          if (equals2(elem, siblings[i5]))
            break;
          if (adapter2.isTag(siblings[i5]))
            pos++;
        }
        return func(pos) && next(elem);
      };
    },
    "nth-last-child"(next, rule, { adapter: adapter2, equals: equals2 }) {
      let func = nthCheck(rule);
      if (func === import_boolbase3.default.falseFunc)
        return import_boolbase3.default.falseFunc;
      if (func === import_boolbase3.default.trueFunc)
        return getChildFunc(next, adapter2);
      return function(elem) {
        let siblings = adapter2.getSiblings(elem), pos = 0;
        for (let i5 = siblings.length - 1;i5 >= 0; i5--) {
          if (equals2(elem, siblings[i5]))
            break;
          if (adapter2.isTag(siblings[i5]))
            pos++;
        }
        return func(pos) && next(elem);
      };
    },
    "nth-of-type"(next, rule, { adapter: adapter2, equals: equals2 }) {
      let func = nthCheck(rule);
      if (func === import_boolbase3.default.falseFunc)
        return import_boolbase3.default.falseFunc;
      if (func === import_boolbase3.default.trueFunc)
        return getChildFunc(next, adapter2);
      return function(elem) {
        let siblings = adapter2.getSiblings(elem), pos = 0;
        for (let i5 = 0;i5 < siblings.length; i5++) {
          let currentSibling = siblings[i5];
          if (equals2(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem))
            pos++;
        }
        return func(pos) && next(elem);
      };
    },
    "nth-last-of-type"(next, rule, { adapter: adapter2, equals: equals2 }) {
      let func = nthCheck(rule);
      if (func === import_boolbase3.default.falseFunc)
        return import_boolbase3.default.falseFunc;
      if (func === import_boolbase3.default.trueFunc)
        return getChildFunc(next, adapter2);
      return function(elem) {
        let siblings = adapter2.getSiblings(elem), pos = 0;
        for (let i5 = siblings.length - 1;i5 >= 0; i5--) {
          let currentSibling = siblings[i5];
          if (equals2(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem))
            pos++;
        }
        return func(pos) && next(elem);
      };
    },
    root(next, _rule, { adapter: adapter2 }) {
      return (elem) => {
        let parent2 = adapter2.getParent(elem);
        return (parent2 == null || !adapter2.isTag(parent2)) && next(elem);
      };
    },
    scope(next, rule, options2, context6) {
      let { equals: equals2 } = options2;
      if (!context6 || context6.length === 0)
        return filters.root(next, rule, options2);
      if (context6.length === 1)
        return (elem) => equals2(context6[0], elem) && next(elem);
      return (elem) => context6.includes(elem) && next(elem);
    },
    hover: dynamicStatePseudo("isHovered"),
    visited: dynamicStatePseudo("isVisited"),
    active: dynamicStatePseudo("isActive")
  };
});
