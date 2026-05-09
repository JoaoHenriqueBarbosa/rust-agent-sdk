// var: init_wsl_utils
var init_wsl_utils = __esm(() => {
  init_is_wsl();
  init_is_wsl();
  wslDrivesMountPoint = (() => {
    let mountPoint;
    return async function() {
      if (mountPoint)
        return mountPoint;
      let configFilePath = "/etc/wsl.conf", isConfigFileExists = !1;
      try {
        await fs7.access(configFilePath, fsConstants.F_OK), isConfigFileExists = !0;
      } catch {}
      if (!isConfigFileExists)
        return "/mnt/";
      let configContent = await fs7.readFile(configFilePath, { encoding: "utf8" }), configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);
      if (!configMountPoint)
        return "/mnt/";
      return mountPoint = configMountPoint.groups.mountPoint.trim(), mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`, mountPoint;
    };
  })();
});
