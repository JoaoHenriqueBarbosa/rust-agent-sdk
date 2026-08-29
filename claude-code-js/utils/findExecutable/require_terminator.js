// var: require_terminator
var require_terminator = __commonJS((exports, module) => {
  var abort = require_abort(), async = require_async();
  module.exports = terminator;
  function terminator(callback) {
    if (!Object.keys(this.jobs).length)
      return;
    this.index = this.size, abort(this), async(callback)(null, this.results);
  }
});
