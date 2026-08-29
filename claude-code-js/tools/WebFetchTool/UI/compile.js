// function: compile
function compile(parsed) {
  let a2 = parsed[0], b = parsed[1] - 1;
  if (b < 0 && a2 <= 0)
    return import_boolbase2.default.falseFunc;
  if (a2 === -1)
    return (index) => index <= b;
  if (a2 === 0)
    return (index) => index === b;
  if (a2 === 1)
    return b < 0 ? import_boolbase2.default.trueFunc : (index) => index >= b;
  let absA = Math.abs(a2), bMod = (b % absA + absA) % absA;
  return a2 > 1 ? (index) => index >= b && index % absA === bMod : (index) => index <= b && index % absA === bMod;
}
