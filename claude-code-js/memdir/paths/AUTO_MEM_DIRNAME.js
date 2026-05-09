// var: AUTO_MEM_DIRNAME
var AUTO_MEM_DIRNAME = "memory", AUTO_MEM_ENTRYPOINT_NAME = "MEMORY.md", getAutoMemPath;
var init_paths = __esm(() => {
  init_memoize();
  init_state();
  init_envUtils();
  init_git();
  init_path2();
  init_settings2();
  getAutoMemPath = memoize_default(() => {
    let override = getAutoMemPathOverride() ?? getAutoMemPathSetting();
    if (override)
      return override;
    let projectsDir = join19(getMemoryBaseDir(), "projects");
    return (join19(projectsDir, sanitizePath2(getAutoMemBase()), AUTO_MEM_DIRNAME) + sep4).normalize("NFC");
  }, () => getProjectRoot());
});
