// var: require_semver3
var require_semver3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isCompatible = exports._makeCompatibilityCheck = void 0;
  var version_1 = require_version3(), re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  function _makeCompatibilityCheck(ownVersion) {
    let acceptedVersions = /* @__PURE__ */ new Set([ownVersion]), rejectedVersions = /* @__PURE__ */ new Set, myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch)
      return () => !1;
    let ownVersionParsed = {
      major: +myVersionMatch[1],
      minor: +myVersionMatch[2],
      patch: +myVersionMatch[3],
      prerelease: myVersionMatch[4]
    };
    if (ownVersionParsed.prerelease != null)
      return function(globalVersion) {
        return globalVersion === ownVersion;
      };
    function _reject(v2) {
      return rejectedVersions.add(v2), !1;
    }
    function _accept(v2) {
      return acceptedVersions.add(v2), !0;
    }
    return function(globalVersion) {
      if (acceptedVersions.has(globalVersion))
        return !0;
      if (rejectedVersions.has(globalVersion))
        return !1;
      let globalVersionMatch = globalVersion.match(re);
      if (!globalVersionMatch)
        return _reject(globalVersion);
      let globalVersionParsed = {
        major: +globalVersionMatch[1],
        minor: +globalVersionMatch[2],
        patch: +globalVersionMatch[3],
        prerelease: globalVersionMatch[4]
      };
      if (globalVersionParsed.prerelease != null)
        return _reject(globalVersion);
      if (ownVersionParsed.major !== globalVersionParsed.major)
        return _reject(globalVersion);
      if (ownVersionParsed.major === 0) {
        if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch)
          return _accept(globalVersion);
        return _reject(globalVersion);
      }
      if (ownVersionParsed.minor <= globalVersionParsed.minor)
        return _accept(globalVersion);
      return _reject(globalVersion);
    };
  }
  exports._makeCompatibilityCheck = _makeCompatibilityCheck;
  exports.isCompatible = _makeCompatibilityCheck(version_1.VERSION);
});
