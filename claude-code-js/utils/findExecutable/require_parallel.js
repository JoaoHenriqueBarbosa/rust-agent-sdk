// var: require_parallel
var require_parallel = __commonJS((exports, module) => {
  var iterate = require_iterate(), initState = require_state(), terminator = require_terminator();
  module.exports = parallel;
  function parallel(list, iterator2, callback) {
    var state = initState(list);
    while (state.index < (state.keyedList || list).length)
      iterate(list, iterator2, state, function(error41, result) {
        if (error41) {
          callback(error41, result);
          return;
        }
        if (Object.keys(state.jobs).length === 0) {
          callback(null, state.results);
          return;
        }
      }), state.index++;
    return terminator.bind(state, callback);
  }
});
