// var: require_valid2
var require_valid2 = __commonJS((exports, module) => {
  var Range = require_range2(), validRange = (range, options) => {
    try {
      return new Range(range, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  module.exports = validRange;
});
