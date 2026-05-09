// function: buildURL
function buildURL(url2, params, options) {
  if (!params)
    return url2;
  let _encode = options && options.encode || encode2, _options = utils_default.isFunction(options) ? {
    serialize: options
  } : options, serializeFn = _options && _options.serialize, serializedParams;
  if (serializeFn)
    serializedParams = serializeFn(params, _options);
  else
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
  if (serializedParams) {
    let hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1)
      url2 = url2.slice(0, hashmarkIndex);
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
