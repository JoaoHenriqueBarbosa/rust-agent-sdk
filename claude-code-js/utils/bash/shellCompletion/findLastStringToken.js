// function: findLastStringToken
function findLastStringToken(tokens) {
  let i5 = tokens.findLastIndex((t2) => typeof t2 === "string");
  return i5 !== -1 ? { token: tokens[i5], index: i5 } : null;
}
