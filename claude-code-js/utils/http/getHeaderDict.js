// function: getHeaderDict
function getHeaderDict(headers) {
  let headerDict = {};
  return headers.forEach((value, key) => {
    headerDict[key] = value;
  }), headerDict;
}
