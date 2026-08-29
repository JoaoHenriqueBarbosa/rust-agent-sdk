// var: require_depTypes
var require_depTypes = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.childDepType = exports.depTypeGreater = exports.DepType = void 0;
  var DepType;
  (function(DepType2) {
    DepType2[DepType2.PROD = 0] = "PROD", DepType2[DepType2.DEV = 1] = "DEV", DepType2[DepType2.OPTIONAL = 2] = "OPTIONAL", DepType2[DepType2.DEV_OPTIONAL = 3] = "DEV_OPTIONAL", DepType2[DepType2.ROOT = 4] = "ROOT";
  })(DepType = exports.DepType || (exports.DepType = {}));
  var depTypeGreater = (newType, existing) => {
    switch (existing) {
      case DepType.DEV:
        switch (newType) {
          case DepType.OPTIONAL:
          case DepType.PROD:
          case DepType.ROOT:
            return !0;
          case DepType.DEV:
          case DepType.DEV_OPTIONAL:
          default:
            return !1;
        }
      case DepType.DEV_OPTIONAL:
        switch (newType) {
          case DepType.OPTIONAL:
          case DepType.PROD:
          case DepType.ROOT:
          case DepType.DEV:
            return !0;
          case DepType.DEV_OPTIONAL:
          default:
            return !1;
        }
      case DepType.OPTIONAL:
        switch (newType) {
          case DepType.PROD:
          case DepType.ROOT:
            return !0;
          case DepType.OPTIONAL:
          case DepType.DEV:
          case DepType.DEV_OPTIONAL:
          default:
            return !1;
        }
      case DepType.PROD:
        switch (newType) {
          case DepType.ROOT:
            return !0;
          case DepType.PROD:
          case DepType.OPTIONAL:
          case DepType.DEV:
          case DepType.DEV_OPTIONAL:
          default:
            return !1;
        }
      case DepType.ROOT:
        switch (newType) {
          case DepType.ROOT:
          case DepType.PROD:
          case DepType.OPTIONAL:
          case DepType.DEV:
          case DepType.DEV_OPTIONAL:
          default:
            return !1;
        }
      default:
        return !1;
    }
  };
  exports.depTypeGreater = depTypeGreater;
  var childDepType = (parentType, childType) => {
    if (childType === DepType.ROOT)
      throw Error("Something went wrong, a child dependency can't be marked as the ROOT");
    switch (parentType) {
      case DepType.ROOT:
        return childType;
      case DepType.PROD:
        if (childType === DepType.OPTIONAL)
          return DepType.OPTIONAL;
        return DepType.PROD;
      case DepType.OPTIONAL:
        return DepType.OPTIONAL;
      case DepType.DEV_OPTIONAL:
        return DepType.DEV_OPTIONAL;
      case DepType.DEV:
        if (childType === DepType.OPTIONAL)
          return DepType.DEV_OPTIONAL;
        return DepType.DEV;
    }
  };
  exports.childDepType = childDepType;
});
