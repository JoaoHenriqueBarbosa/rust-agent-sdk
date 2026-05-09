// function: parseSubscriptIndex
function parseSubscriptIndex(P2, startB, endB) {
  let text2 = sliceBytes(P2, startB, endB);
  if (/^\d+$/.test(text2))
    return mk(P2, "number", startB, endB, []);
  if (/^\$([a-zA-Z_]\w*)$/.exec(text2)) {
    let dollar = mk(P2, "$", startB, startB + 1, []), vn = mk(P2, "variable_name", startB + 1, endB, []);
    return mk(P2, "simple_expansion", startB, endB, [dollar, vn]);
  }
  if (text2.length === 2 && text2[0] === "$" && SPECIAL_VARS.has(text2[1])) {
    let dollar = mk(P2, "$", startB, startB + 1, []), vn = mk(P2, "special_variable_name", startB + 1, endB, []);
    return mk(P2, "simple_expansion", startB, endB, [dollar, vn]);
  }
  return mk(P2, "word", startB, endB, []);
}
