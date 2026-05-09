// function: spread
function spread(callback) {
  return function(arr) {
    return callback.apply(null, arr);
  };
}
