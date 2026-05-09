// var: require_populate
var require_populate = __commonJS((exports, module) => {
  module.exports = function(dst, src) {
    return Object.keys(src).forEach(function(prop) {
      dst[prop] = dst[prop] || src[prop];
    }), dst;
  };
});
