// function: getQueryStringOverride
function getQueryStringOverride(id, url3, numVariations) {
  if (!url3)
    return null;
  let search = url3.split("?")[1];
  if (!search)
    return null;
  let match = search.replace(/#.*/, "").split("&").map((kv) => kv.split("=", 2)).filter(([k3]) => k3 === id).map(([, v2]) => parseInt(v2));
  if (match.length > 0 && match[0] >= 0 && match[0] < numVariations)
    return match[0];
  return null;
}
