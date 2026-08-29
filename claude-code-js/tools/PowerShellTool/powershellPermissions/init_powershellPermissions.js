// var: init_powershellPermissions
var init_powershellPermissions = __esm(() => {
  init_cwd2();
  init_git();
  init_permissions2();
  init_shellRuleMatching();
  init_parser5();
  init_readOnlyCommandValidation();
  init_gitSafety();
  init_modeValidation();
  init_pathValidation3();
  init_powershellSecurity();
  init_readOnlyValidation2();
  PS_ASSIGN_PREFIX_RE = /^\$[\w:]+\s*(?:[+\-*/%]|\?\?)?\s*=\s*/, GIT_SAFETY_WRITE_CMDLETS = /* @__PURE__ */ new Set([
    "new-item",
    "set-content",
    "add-content",
    "out-file",
    "copy-item",
    "move-item",
    "rename-item",
    "expand-archive",
    "invoke-webrequest",
    "invoke-restmethod",
    "tee-object",
    "export-csv",
    "export-clixml"
  ]), GIT_SAFETY_ARCHIVE_EXTRACTORS = /* @__PURE__ */ new Set([
    "tar",
    "tar.exe",
    "bsdtar",
    "bsdtar.exe",
    "unzip",
    "unzip.exe",
    "7z",
    "7z.exe",
    "7za",
    "7za.exe",
    "gzip",
    "gzip.exe",
    "gunzip",
    "gunzip.exe",
    "expand-archive"
  ]);
});
