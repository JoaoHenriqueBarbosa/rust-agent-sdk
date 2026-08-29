// var: require_quote
var require_quote = __commonJS((exports, module) => {
  module.exports = function(xs) {
    return xs.map(function(s2) {
      if (s2 === "")
        return "''";
      if (s2 && typeof s2 === "object")
        return s2.op.replace(/(.)/g, "\\$1");
      if (/["\s\\]/.test(s2) && !/'/.test(s2))
        return "'" + s2.replace(/(['])/g, "\\$1") + "'";
      if (/["'\s]/.test(s2))
        return '"' + s2.replace(/(["\\$`!])/g, "\\$1") + '"';
      return String(s2).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2");
    }).join(" ");
  };
});
