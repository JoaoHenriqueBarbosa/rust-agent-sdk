// var: require_src
var require_src = __commonJS((exports, module) => {
  if (typeof process > "u" || process.type === "renderer" || !1 || process.__nwjs)
    module.exports = require_browser();
  else
    module.exports = require_node();
});
