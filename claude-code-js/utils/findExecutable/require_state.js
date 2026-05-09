// var: require_state
var require_state = __commonJS((exports, module) => {
  module.exports = state;
  function state(list, sortMethod) {
    var isNamedList = !Array.isArray(list), initState = {
      index: 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs: {},
      results: isNamedList ? {} : [],
      size: isNamedList ? Object.keys(list).length : list.length
    };
    if (sortMethod)
      initState.keyedList.sort(isNamedList ? sortMethod : function(a2, b) {
        return sortMethod(list[a2], list[b]);
      });
    return initState;
  }
});
