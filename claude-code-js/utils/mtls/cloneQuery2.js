// function: cloneQuery2
function cloneQuery2(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    let param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
