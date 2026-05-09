// var: require_to_comparators
var require_to_comparators = __commonJS((exports, module) => {
  var Range = require_range2(), toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c3) => c3.value).join(" ").trim().split(" "));
  module.exports = toComparators;
});
