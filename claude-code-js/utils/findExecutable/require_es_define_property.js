// var: require_es_define_property
var require_es_define_property = __commonJS((exports, module) => {
  var $defineProperty = Object.defineProperty || !1;
  if ($defineProperty)
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = !1;
    }
  module.exports = $defineProperty;
});
