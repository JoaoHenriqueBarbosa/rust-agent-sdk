// function: transformData
function transformData(fns, response) {
  let config2 = this || defaults_default, context = response || config2, headers = AxiosHeaders_default.from(context.headers), data = context.data;
  return utils_default.forEach(fns, function(fn) {
    data = fn.call(config2, data, headers.normalize(), response ? response.status : void 0);
  }), headers.normalize(), data;
}
