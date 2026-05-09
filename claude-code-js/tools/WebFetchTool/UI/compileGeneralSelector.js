// function: compileGeneralSelector
function compileGeneralSelector(next, selector, options2, context6, compileToken) {
  let { adapter: adapter2, equals: equals2 } = options2;
  switch (selector.type) {
    case SelectorType.PseudoElement:
      throw Error("Pseudo-elements are not supported by css-select");
    case SelectorType.ColumnCombinator:
      throw Error("Column combinators are not yet supported by css-select");
    case SelectorType.Attribute: {
      if (selector.namespace != null)
        throw Error("Namespaced attributes are not yet supported by css-select");
      if (!options2.xmlMode || options2.lowerCaseAttributeNames)
        selector.name = selector.name.toLowerCase();
      return attributeRules[selector.action](next, selector, options2);
    }
    case SelectorType.Pseudo:
      return compilePseudoSelector(next, selector, options2, context6, compileToken);
    case SelectorType.Tag: {
      if (selector.namespace != null)
        throw Error("Namespaced tag names are not yet supported by css-select");
      let { name: name3 } = selector;
      if (!options2.xmlMode || options2.lowerCaseTags)
        name3 = name3.toLowerCase();
      return function(elem) {
        return adapter2.getName(elem) === name3 && next(elem);
      };
    }
    case SelectorType.Descendant: {
      if (options2.cacheResults === !1 || typeof WeakSet > "u")
        return function(elem) {
          let current = elem;
          while (current = getElementParent(current, adapter2))
            if (next(current))
              return !0;
          return !1;
        };
      let isFalseCache = /* @__PURE__ */ new WeakSet;
      return function(elem) {
        let current = elem;
        while (current = getElementParent(current, adapter2))
          if (!isFalseCache.has(current)) {
            if (adapter2.isTag(current) && next(current))
              return !0;
            isFalseCache.add(current);
          }
        return !1;
      };
    }
    case "_flexibleDescendant":
      return function(elem) {
        let current = elem;
        do
          if (next(current))
            return !0;
        while (current = getElementParent(current, adapter2));
        return !1;
      };
    case SelectorType.Parent:
      return function(elem) {
        return adapter2.getChildren(elem).some((elem2) => adapter2.isTag(elem2) && next(elem2));
      };
    case SelectorType.Child:
      return function(elem) {
        let parent2 = adapter2.getParent(elem);
        return parent2 != null && adapter2.isTag(parent2) && next(parent2);
      };
    case SelectorType.Sibling:
      return function(elem) {
        let siblings = adapter2.getSiblings(elem);
        for (let i5 = 0;i5 < siblings.length; i5++) {
          let currentSibling = siblings[i5];
          if (equals2(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling) && next(currentSibling))
            return !0;
        }
        return !1;
      };
    case SelectorType.Adjacent: {
      if (adapter2.prevElementSibling)
        return function(elem) {
          let previous = adapter2.prevElementSibling(elem);
          return previous != null && next(previous);
        };
      return function(elem) {
        let siblings = adapter2.getSiblings(elem), lastElement;
        for (let i5 = 0;i5 < siblings.length; i5++) {
          let currentSibling = siblings[i5];
          if (equals2(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling))
            lastElement = currentSibling;
        }
        return !!lastElement && next(lastElement);
      };
    }
    case SelectorType.Universal: {
      if (selector.namespace != null && selector.namespace !== "*")
        throw Error("Namespaced universal selectors are not yet supported by css-select");
      return next;
    }
  }
}
