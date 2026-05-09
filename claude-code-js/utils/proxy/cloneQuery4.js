// function: cloneQuery4
function cloneQuery4(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    let param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
