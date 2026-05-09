// function: parseHeaderValueAsNumber
function parseHeaderValueAsNumber(response7, headerName) {
  let value = response7.headers.get(headerName);
  if (!value)
    return;
  let valueAsNum = Number(value);
  if (Number.isNaN(valueAsNum))
    return;
  return valueAsNum;
}
