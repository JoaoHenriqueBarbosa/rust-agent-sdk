// var: init_subselects
var init_subselects = __esm(() => {
  init_sort();
  import_boolbase4 = __toESM(require_boolbase(), 1), PLACEHOLDER_ELEMENT = {};
  subselects = {
    is,
    matches: is,
    where: is,
    not(next, token, options2, context6, compileToken) {
      let func = compileToken(token, copyOptions(options2), context6);
      return func === import_boolbase4.default.falseFunc ? next : func === import_boolbase4.default.trueFunc ? import_boolbase4.default.falseFunc : (elem) => !func(elem) && next(elem);
    },
    has(next, subselect, options2, _context, compileToken) {
      let { adapter: adapter2 } = options2, opts = copyOptions(options2);
      opts.relativeSelector = !0;
      let context6 = subselect.some((s2) => s2.some(isTraversal2)) ? [PLACEHOLDER_ELEMENT] : void 0, compiled = compileToken(subselect, opts, context6);
      if (compiled === import_boolbase4.default.falseFunc)
        return import_boolbase4.default.falseFunc;
      let hasElement = ensureIsTag(compiled, adapter2);
      if (context6 && compiled !== import_boolbase4.default.trueFunc) {
        let { shouldTestNextSiblings = !1 } = compiled;
        return (elem) => {
          if (!next(elem))
            return !1;
          context6[0] = elem;
          let childs = adapter2.getChildren(elem), nextElements = shouldTestNextSiblings ? [...childs, ...getNextSiblings(elem, adapter2)] : childs;
          return adapter2.existsOne(hasElement, nextElements);
        };
      }
      return (elem) => next(elem) && adapter2.existsOne(hasElement, adapter2.getChildren(elem));
    }
  };
});
