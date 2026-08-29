// function: replaceSuffix
function replaceSuffix(string5, oldSuffix, newSuffix) {
  if (!oldSuffix)
    return string5 + newSuffix;
  if (string5.slice(-oldSuffix.length) != oldSuffix)
    throw Error("string ".concat(JSON.stringify(string5), " doesn't end with suffix ").concat(JSON.stringify(oldSuffix), "; this is a bug"));
  return string5.slice(0, -oldSuffix.length) + newSuffix;
}
