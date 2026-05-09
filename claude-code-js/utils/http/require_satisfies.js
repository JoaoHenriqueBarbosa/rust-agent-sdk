// var: require_satisfies
var require_satisfies = __commonJS((exports, module) => {
  var Range = require_range2(), satisfies = (version4, range, options) => {
    try {
      range = new Range(range, options);
    } catch (er) {
      return !1;
    }
    return range.test(version4);
  };
  module.exports = satisfies;
});
