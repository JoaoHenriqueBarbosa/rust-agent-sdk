// function: replacePrefix
function replacePrefix(string5, oldPrefix, newPrefix) {
  if (string5.slice(0, oldPrefix.length) != oldPrefix)
    throw Error("string ".concat(JSON.stringify(string5), " doesn't start with prefix ").concat(JSON.stringify(oldPrefix), "; this is a bug"));
  return newPrefix + string5.slice(oldPrefix.length);
}
