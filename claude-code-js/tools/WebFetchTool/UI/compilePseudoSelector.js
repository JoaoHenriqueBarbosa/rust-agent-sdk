// function: compilePseudoSelector
function compilePseudoSelector(next, selector, options2, context6, compileToken) {
  var _a4;
  let { name: name3, data } = selector;
  if (Array.isArray(data)) {
    if (!(name3 in subselects))
      throw Error(`Unknown pseudo-class :${name3}(${data})`);
    return subselects[name3](next, data, options2, context6, compileToken);
  }
  let userPseudo = (_a4 = options2.pseudos) === null || _a4 === void 0 ? void 0 : _a4[name3], stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name3];
  if (typeof stringPseudo === "string") {
    if (data != null)
      throw Error(`Pseudo ${name3} doesn't have any arguments`);
    let alias = parse15(stringPseudo);
    return subselects.is(next, alias, options2, context6, compileToken);
  }
  if (typeof userPseudo === "function")
    return verifyPseudoArgs(userPseudo, name3, data, 1), (elem) => userPseudo(elem, data) && next(elem);
  if (name3 in filters)
    return filters[name3](next, data, options2, context6);
  if (name3 in pseudos) {
    let pseudo = pseudos[name3];
    return verifyPseudoArgs(pseudo, name3, data, 2), (elem) => pseudo(elem, options2, data) && next(elem);
  }
  throw Error(`Unknown pseudo-class :${name3}`);
}
