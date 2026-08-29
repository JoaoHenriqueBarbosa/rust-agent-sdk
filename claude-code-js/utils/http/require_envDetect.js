// var: require_envDetect
var require_envDetect = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GCPEnv = void 0;
  exports.clear = clear;
  exports.getEnv = getEnv3;
  var gcpMetadata = require_src4(), GCPEnv;
  (function(GCPEnv2) {
    GCPEnv2.APP_ENGINE = "APP_ENGINE", GCPEnv2.KUBERNETES_ENGINE = "KUBERNETES_ENGINE", GCPEnv2.CLOUD_FUNCTIONS = "CLOUD_FUNCTIONS", GCPEnv2.COMPUTE_ENGINE = "COMPUTE_ENGINE", GCPEnv2.CLOUD_RUN = "CLOUD_RUN", GCPEnv2.NONE = "NONE";
  })(GCPEnv || (exports.GCPEnv = GCPEnv = {}));
  var envPromise;
  function clear() {
    envPromise = void 0;
  }
  async function getEnv3() {
    if (envPromise)
      return envPromise;
    return envPromise = getEnvMemoized(), envPromise;
  }
  async function getEnvMemoized() {
    let env5 = GCPEnv.NONE;
    if (isAppEngine())
      env5 = GCPEnv.APP_ENGINE;
    else if (isCloudFunction())
      env5 = GCPEnv.CLOUD_FUNCTIONS;
    else if (await isComputeEngine())
      if (await isKubernetesEngine())
        env5 = GCPEnv.KUBERNETES_ENGINE;
      else if (isCloudRun())
        env5 = GCPEnv.CLOUD_RUN;
      else
        env5 = GCPEnv.COMPUTE_ENGINE;
    else
      env5 = GCPEnv.NONE;
    return env5;
  }
  function isAppEngine() {
    return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME);
  }
  function isCloudFunction() {
    return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET);
  }
  function isCloudRun() {
    return !!process.env.K_CONFIGURATION;
  }
  async function isKubernetesEngine() {
    try {
      return await gcpMetadata.instance("attributes/cluster-name"), !0;
    } catch (e) {
      return !1;
    }
  }
  async function isComputeEngine() {
    return gcpMetadata.isAvailable();
  }
});
