// function: renderKey
function renderKey(path9, key, dots) {
  if (!path9)
    return key;
  return path9.concat(key).map(function(token, i2) {
    return token = removeBrackets(token), !dots && i2 ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
