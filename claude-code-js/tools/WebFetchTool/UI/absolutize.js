// function: absolutize
function absolutize(token, { adapter: adapter2 }, context6) {
  let hasContext = !!(context6 === null || context6 === void 0 ? void 0 : context6.every((e) => {
    let parent2 = adapter2.isTag(e) && adapter2.getParent(e);
    return e === PLACEHOLDER_ELEMENT || parent2 && adapter2.isTag(parent2);
  }));
  for (let t2 of token) {
    if (t2.length > 0 && isTraversal2(t2[0]) && t2[0].type !== SelectorType.Descendant)
      ;
    else if (hasContext && !t2.some(includesScopePseudo))
      t2.unshift(DESCENDANT_TOKEN);
    else
      continue;
    t2.unshift(SCOPE_TOKEN);
  }
}
