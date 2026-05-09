// function: bind
function bind(fn, thisArg) {
  return function() {
    return fn.apply(thisArg, arguments);
  };
}
