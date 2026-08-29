// var: require_constants2
var require_constants2 = __commonJS((exports, module) => {
  var MAX_SAFE_INTEGER3 = Number.MAX_SAFE_INTEGER || 9007199254740991, RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  module.exports = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER3,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
});
