// var: init_pseudos
var init_pseudos = __esm(() => {
  pseudos = {
    empty(elem, { adapter: adapter2 }) {
      return !adapter2.getChildren(elem).some((elem2) => adapter2.isTag(elem2) || adapter2.getText(elem2) !== "");
    },
    "first-child"(elem, { adapter: adapter2, equals: equals2 }) {
      if (adapter2.prevElementSibling)
        return adapter2.prevElementSibling(elem) == null;
      let firstChild = adapter2.getSiblings(elem).find((elem2) => adapter2.isTag(elem2));
      return firstChild != null && equals2(elem, firstChild);
    },
    "last-child"(elem, { adapter: adapter2, equals: equals2 }) {
      let siblings = adapter2.getSiblings(elem);
      for (let i5 = siblings.length - 1;i5 >= 0; i5--) {
        if (equals2(elem, siblings[i5]))
          return !0;
        if (adapter2.isTag(siblings[i5]))
          break;
      }
      return !1;
    },
    "first-of-type"(elem, { adapter: adapter2, equals: equals2 }) {
      let siblings = adapter2.getSiblings(elem), elemName = adapter2.getName(elem);
      for (let i5 = 0;i5 < siblings.length; i5++) {
        let currentSibling = siblings[i5];
        if (equals2(elem, currentSibling))
          return !0;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName)
          break;
      }
      return !1;
    },
    "last-of-type"(elem, { adapter: adapter2, equals: equals2 }) {
      let siblings = adapter2.getSiblings(elem), elemName = adapter2.getName(elem);
      for (let i5 = siblings.length - 1;i5 >= 0; i5--) {
        let currentSibling = siblings[i5];
        if (equals2(elem, currentSibling))
          return !0;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName)
          break;
      }
      return !1;
    },
    "only-of-type"(elem, { adapter: adapter2, equals: equals2 }) {
      let elemName = adapter2.getName(elem);
      return adapter2.getSiblings(elem).every((sibling) => equals2(elem, sibling) || !adapter2.isTag(sibling) || adapter2.getName(sibling) !== elemName);
    },
    "only-child"(elem, { adapter: adapter2, equals: equals2 }) {
      return adapter2.getSiblings(elem).every((sibling) => equals2(elem, sibling) || !adapter2.isTag(sibling));
    }
  };
});
