// var: require_serialOrdered
var require_serialOrdered = __commonJS((exports, module) => {
  var iterate = require_iterate(), initState = require_state(), terminator = require_terminator();
  module.exports = serialOrdered;
  module.exports.ascending = ascending;
  module.exports.descending = descending;
  function serialOrdered(list, iterator2, sortMethod, callback) {
    var state = initState(list, sortMethod);
    return iterate(list, iterator2, state, function iteratorHandler(error41, result) {
      if (error41) {
        callback(error41, result);
        return;
      }
      if (state.index++, state.index < (state.keyedList || list).length) {
        iterate(list, iterator2, state, iteratorHandler);
        return;
      }
      callback(null, state.results);
    }), terminator.bind(state, callback);
  }
  function ascending(a2, b) {
    return a2 < b ? -1 : a2 > b ? 1 : 0;
  }
  function descending(a2, b) {
    return -1 * ascending(a2, b);
  }
});
