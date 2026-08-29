// function: compileToken
function compileToken(token, options2, context6) {
  var _a4;
  token.forEach(sortByProcedure), context6 = (_a4 = options2.context) !== null && _a4 !== void 0 ? _a4 : context6;
  let isArrayContext = Array.isArray(context6), finalContext = context6 && (Array.isArray(context6) ? context6 : [context6]);
  if (options2.relativeSelector !== !1)
    absolutize(token, options2, finalContext);
  else if (token.some((t2) => t2.length > 0 && isTraversal2(t2[0])))
    throw Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  let shouldTestNextSiblings = !1, query2 = token.map((rules) => {
    if (rules.length >= 2) {
      let [first, second] = rules;
      if (first.type !== SelectorType.Pseudo || first.name !== "scope")
        ;
      else if (isArrayContext && second.type === SelectorType.Descendant)
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      else if (second.type === SelectorType.Adjacent || second.type === SelectorType.Sibling)
        shouldTestNextSiblings = !0;
    }
    return compileRules(rules, options2, finalContext);
  }).reduce(reduceRules, import_boolbase5.default.falseFunc);
  return query2.shouldTestNextSiblings = shouldTestNextSiblings, query2;
}
