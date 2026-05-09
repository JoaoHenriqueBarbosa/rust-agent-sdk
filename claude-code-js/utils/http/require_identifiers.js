// var: require_identifiers
var require_identifiers = __commonJS((exports, module) => {
  var numeric = /^[0-9]+$/, compareIdentifiers = (a2, b) => {
    if (typeof a2 === "number" && typeof b === "number")
      return a2 === b ? 0 : a2 < b ? -1 : 1;
    let anum = numeric.test(a2), bnum = numeric.test(b);
    if (anum && bnum)
      a2 = +a2, b = +b;
    return a2 === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a2 < b ? -1 : 1;
  }, rcompareIdentifiers = (a2, b) => compareIdentifiers(b, a2);
  module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
  };
});
