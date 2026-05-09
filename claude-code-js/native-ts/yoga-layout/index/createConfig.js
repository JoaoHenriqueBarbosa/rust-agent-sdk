// function: createConfig
function createConfig() {
  let config8 = {
    pointScaleFactor: 1,
    errata: Errata.None,
    useWebDefaults: !1,
    free() {},
    isExperimentalFeatureEnabled() {
      return !1;
    },
    setExperimentalFeatureEnabled() {},
    setPointScaleFactor(f) {
      config8.pointScaleFactor = f;
    },
    getErrata() {
      return config8.errata;
    },
    setErrata(e) {
      config8.errata = e;
    },
    setUseWebDefaults(v2) {
      config8.useWebDefaults = v2;
    }
  };
  return config8;
}
