// var: require_simplify
var require_simplify = __commonJS((exports, module) => {
  var satisfies = require_satisfies(), compare = require_compare();
  module.exports = (versions2, range, options) => {
    let set2 = [], first = null, prev = null, v2 = versions2.sort((a2, b) => compare(a2, b, options));
    for (let version4 of v2)
      if (satisfies(version4, range, options)) {
        if (prev = version4, !first)
          first = version4;
      } else {
        if (prev)
          set2.push([first, prev]);
        prev = null, first = null;
      }
    if (first)
      set2.push([first, null]);
    let ranges = [];
    for (let [min, max] of set2)
      if (min === max)
        ranges.push(min);
      else if (!max && min === v2[0])
        ranges.push("*");
      else if (!max)
        ranges.push(`>=${min}`);
      else if (min === v2[0])
        ranges.push(`<=${max}`);
      else
        ranges.push(`${min} - ${max}`);
    let simplified = ranges.join(" || "), original = typeof range.raw === "string" ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
  };
});
