// function: simpleParseQueryParams
function simpleParseQueryParams(queryString) {
  let result = /* @__PURE__ */ new Map;
  if (!queryString || queryString[0] !== "?")
    return result;
  queryString = queryString.slice(1);
  let pairs = queryString.split("&");
  for (let pair of pairs) {
    let [name3, value] = pair.split("=", 2), existingValue = result.get(name3);
    if (existingValue)
      if (Array.isArray(existingValue))
        existingValue.push(value);
      else
        result.set(name3, [existingValue, value]);
    else
      result.set(name3, value);
  }
  return result;
}
