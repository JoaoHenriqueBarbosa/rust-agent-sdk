// function: getFetchHeaders
function getFetchHeaders(options) {
  let headers = /* @__PURE__ */ new Headers;
  if (!(options && options.headers))
    return headers;
  return Object.entries(options.headers).forEach(([key, value]) => {
    headers.append(key, value);
  }), headers;
}
