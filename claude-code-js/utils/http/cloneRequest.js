// var: cloneRequest
var cloneRequest = ({ headers, query, ...rest }) => ({
  ...rest,
  headers: { ...headers },
  query: query ? cloneQuery6(query) : void 0
}), cloneQuery6 = (query) => Object.keys(query).reduce((carry, paramName) => {
  let param = query[paramName];
  return {
    ...carry,
    [paramName]: Array.isArray(param) ? [...param] : param
  };
}, {});
