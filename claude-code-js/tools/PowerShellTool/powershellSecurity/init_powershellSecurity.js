// var: init_powershellSecurity
var init_powershellSecurity = __esm(() => {
  init_dangerousCmdlets();
  init_parser5();
  init_clmTypes();
  POWERSHELL_EXECUTABLES = /* @__PURE__ */ new Set([
    "pwsh",
    "pwsh.exe",
    "powershell",
    "powershell.exe"
  ]);
  PS_ALT_PARAM_PREFIXES = /* @__PURE__ */ new Set([
    "/",
    "\u2013",
    "\u2014",
    "\u2015"
  ]);
  DOWNLOADER_NAMES = /* @__PURE__ */ new Set([
    "invoke-webrequest",
    "iwr",
    "invoke-restmethod",
    "irm",
    "new-object",
    "start-bitstransfer"
  ]);
  SAFE_SCRIPT_BLOCK_CMDLETS = /* @__PURE__ */ new Set([
    "where-object",
    "sort-object",
    "select-object",
    "group-object",
    "format-table",
    "format-list",
    "format-wide",
    "format-custom"
  ]);
  SCHEDULED_TASK_CMDLETS = /* @__PURE__ */ new Set([
    "register-scheduledtask",
    "new-scheduledtask",
    "new-scheduledtaskaction",
    "set-scheduledtask"
  ]);
  ENV_WRITE_CMDLETS = /* @__PURE__ */ new Set([
    "set-item",
    "si",
    "new-item",
    "ni",
    "remove-item",
    "ri",
    "del",
    "rm",
    "rd",
    "rmdir",
    "erase",
    "clear-item",
    "cli",
    "set-content",
    "add-content",
    "ac"
  ]);
  RUNTIME_STATE_CMDLETS = /* @__PURE__ */ new Set([
    "set-alias",
    "sal",
    "new-alias",
    "nal",
    "set-variable",
    "sv",
    "new-variable",
    "nv"
  ]);
  WMI_SPAWN_CMDLETS = /* @__PURE__ */ new Set([
    "invoke-wmimethod",
    "iwmi",
    "invoke-cimmethod"
  ]);
});
