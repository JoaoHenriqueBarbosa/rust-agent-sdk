// function: encodeHeaders
function encodeHeaders(headers) {
  let result = "";
  for (let [key, value] of headers)
    result += `${key}: ${value}\r
`;
  return result;
}
