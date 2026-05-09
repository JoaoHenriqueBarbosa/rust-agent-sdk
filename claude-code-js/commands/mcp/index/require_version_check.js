// var: require_version_check
var require_version_check = __commonJS((exports) => {
  exports.isValid = function(version5) {
    return !isNaN(version5) && version5 >= 1 && version5 <= 40;
  };
});
