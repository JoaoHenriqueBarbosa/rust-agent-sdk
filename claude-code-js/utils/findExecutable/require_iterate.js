// var: require_iterate
var require_iterate = __commonJS((exports, module) => {
  var async = require_async(), abort = require_abort();
  module.exports = iterate;
  function iterate(list, iterator2, state, callback) {
    var key = state.keyedList ? state.keyedList[state.index] : state.index;
    state.jobs[key] = runJob(iterator2, key, list[key], function(error41, output) {
      if (!(key in state.jobs))
        return;
      if (delete state.jobs[key], error41)
        abort(state);
      else
        state.results[key] = output;
      callback(error41, state.results);
    });
  }
  function runJob(iterator2, key, item, callback) {
    var aborter;
    if (iterator2.length == 2)
      aborter = iterator2(item, async(callback));
    else
      aborter = iterator2(item, key, async(callback));
    return aborter;
  }
});
