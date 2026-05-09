// function: getProcedure
function getProcedure(token) {
  var _a4, _b2;
  let proc = (_a4 = procedure.get(token.type)) !== null && _a4 !== void 0 ? _a4 : -1;
  if (token.type === SelectorType.Attribute) {
    if (proc = (_b2 = attributes.get(token.action)) !== null && _b2 !== void 0 ? _b2 : 4, token.action === AttributeAction.Equals && token.name === "id")
      proc = 9;
    if (token.ignoreCase)
      proc >>= 1;
  } else if (token.type === SelectorType.Pseudo)
    if (!token.data)
      proc = 3;
    else if (token.name === "has" || token.name === "contains")
      proc = 0;
    else if (Array.isArray(token.data)) {
      if (proc = Math.min(...token.data.map((d) => Math.min(...d.map(getProcedure)))), proc < 0)
        proc = 0;
    } else
      proc = 2;
  return proc;
}
