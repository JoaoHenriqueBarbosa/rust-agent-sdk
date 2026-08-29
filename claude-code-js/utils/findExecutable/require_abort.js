// var: require_abort
var require_abort = __commonJS((exports, module) => {
  module.exports = abort;
  function abort(state) {
    Object.keys(state.jobs).forEach(clean.bind(state)), state.jobs = {};
  }
  function clean(key) {
    if (typeof this.jobs[key] == "function")
      this.jobs[key]();
  }
});
