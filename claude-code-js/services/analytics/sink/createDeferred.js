// var: createDeferred
var createDeferred = () => {
  let methods = {}, promise2 = new Promise((resolve2, reject) => {
    Object.assign(methods, { resolve: resolve2, reject });
  });
  return Object.assign(promise2, methods);
};
