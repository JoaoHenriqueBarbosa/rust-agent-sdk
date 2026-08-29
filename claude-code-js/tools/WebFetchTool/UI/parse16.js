// function: parse16
function parse16(formula) {
  if (formula = formula.trim().toLowerCase(), formula === "even")
    return [2, 0];
  else if (formula === "odd")
    return [2, 1];
  let idx = 0, a2 = 0, sign3 = readSign(), number5 = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n")
    if (idx++, a2 = sign3 * (number5 !== null && number5 !== void 0 ? number5 : 1), skipWhitespace(), idx < formula.length)
      sign3 = readSign(), skipWhitespace(), number5 = readNumber();
    else
      sign3 = number5 = 0;
  if (number5 === null || idx < formula.length)
    throw Error(`n-th rule couldn't be parsed ('${formula}')`);
  return [a2, sign3 * number5];
  function readSign() {
    if (formula.charAt(idx) === "-")
      return idx++, -1;
    if (formula.charAt(idx) === "+")
      idx++;
    return 1;
  }
  function readNumber() {
    let start = idx, value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= 48 && formula.charCodeAt(idx) <= 57)
      value = value * 10 + (formula.charCodeAt(idx) - 48), idx++;
    return idx === start ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx)))
      idx++;
  }
}
