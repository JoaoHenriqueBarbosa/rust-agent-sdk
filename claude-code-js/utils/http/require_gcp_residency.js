// var: require_gcp_residency
var require_gcp_residency = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GCE_LINUX_BIOS_PATHS = void 0;
  exports.isGoogleCloudServerless = isGoogleCloudServerless;
  exports.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
  exports.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
  exports.isGoogleComputeEngine = isGoogleComputeEngine;
  exports.detectGCPResidency = detectGCPResidency;
  var fs_1 = __require("fs"), os_1 = __require("os");
  exports.GCE_LINUX_BIOS_PATHS = {
    BIOS_DATE: "/sys/class/dmi/id/bios_date",
    BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
  };
  var GCE_MAC_ADDRESS_REGEX = /^42:01/;
  function isGoogleCloudServerless() {
    return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE);
  }
  function isGoogleComputeEngineLinux() {
    if ((0, os_1.platform)() !== "linux")
      return !1;
    try {
      (0, fs_1.statSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
      let biosVendor = (0, fs_1.readFileSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
      return /Google/.test(biosVendor);
    } catch (_a2) {
      return !1;
    }
  }
  function isGoogleComputeEngineMACAddress() {
    let interfaces = (0, os_1.networkInterfaces)();
    for (let item of Object.values(interfaces)) {
      if (!item)
        continue;
      for (let { mac } of item)
        if (GCE_MAC_ADDRESS_REGEX.test(mac))
          return !0;
    }
    return !1;
  }
  function isGoogleComputeEngine() {
    return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
  }
  function detectGCPResidency() {
    return isGoogleCloudServerless() || isGoogleComputeEngine();
  }
});
