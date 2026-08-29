// function: cloneQuery5
function cloneQuery5(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    let param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
