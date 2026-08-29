// function: appendQueryParams
function appendQueryParams(url3, queryParams, sequenceParams, noOverwrite = !1) {
  if (queryParams.size === 0)
    return url3;
  let parsedUrl = new URL(url3), combinedParams = simpleParseQueryParams(parsedUrl.search);
  for (let [name3, value] of queryParams) {
    let existingValue = combinedParams.get(name3);
    if (Array.isArray(existingValue))
      if (Array.isArray(value)) {
        existingValue.push(...value);
        let valueSet = new Set(existingValue);
        combinedParams.set(name3, Array.from(valueSet));
      } else
        existingValue.push(value);
    else if (existingValue) {
      if (Array.isArray(value))
        value.unshift(existingValue);
      else if (sequenceParams.has(name3))
        combinedParams.set(name3, [existingValue, value]);
      if (!noOverwrite)
        combinedParams.set(name3, value);
    } else
      combinedParams.set(name3, value);
  }
  let searchPieces = [];
  for (let [name3, value] of combinedParams)
    if (typeof value === "string")
      searchPieces.push(`${name3}=${value}`);
    else if (Array.isArray(value))
      for (let subValue of value)
        searchPieces.push(`${name3}=${subValue}`);
    else
      searchPieces.push(`${name3}=${value}`);
  return parsedUrl.search = searchPieces.length ? `?${searchPieces.join("&")}` : "", parsedUrl.toString();
}
