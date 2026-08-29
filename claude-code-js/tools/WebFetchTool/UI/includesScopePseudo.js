// function: includesScopePseudo
function includesScopePseudo(t2) {
  return t2.type === SelectorType.Pseudo && (t2.name === "scope" || Array.isArray(t2.data) && t2.data.some((data) => data.some(includesScopePseudo)));
}
