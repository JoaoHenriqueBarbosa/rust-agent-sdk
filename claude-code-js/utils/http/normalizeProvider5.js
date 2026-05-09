// var: normalizeProvider5
var normalizeProvider5 = (input) => {
  if (typeof input === "function")
    return input;
  let promisified = Promise.resolve(input);
  return () => promisified;
};
