// function: getResponseHeaders
function getResponseHeaders(res) {
  let headers = createHttpHeaders();
  for (let header of Object.keys(res.headers)) {
    let value = res.headers[header];
    if (Array.isArray(value)) {
      if (value.length > 0)
        headers.set(header, value[0]);
    } else if (value)
      headers.set(header, value);
  }
  return headers;
}
