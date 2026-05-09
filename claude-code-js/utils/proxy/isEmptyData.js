// function: isEmptyData
function isEmptyData(data) {
  if (typeof data === "string")
    return data.length === 0;
  return data.byteLength === 0;
}
