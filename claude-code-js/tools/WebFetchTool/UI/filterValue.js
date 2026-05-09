// function: filterValue
function filterValue(rule, node2, options2) {
  var filter3 = rule.filter;
  if (typeof filter3 === "string") {
    if (filter3 === node2.nodeName.toLowerCase())
      return !0;
  } else if (Array.isArray(filter3)) {
    if (filter3.indexOf(node2.nodeName.toLowerCase()) > -1)
      return !0;
  } else if (typeof filter3 === "function") {
    if (filter3.call(rule, node2, options2))
      return !0;
  } else
    throw TypeError("`filter` needs to be a string, array, or function");
}
