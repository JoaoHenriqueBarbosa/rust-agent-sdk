// Original: src/utils/powershell/dangerousCmdlets.ts
function aliasesOf(targets) {
  return Object.entries(COMMON_ALIASES).filter(([, target]) => targets.has(target.toLowerCase())).map(([alias]) => alias);
}
var FILEPATH_EXECUTION_CMDLETS, DANGEROUS_SCRIPT_BLOCK_CMDLETS, MODULE_LOADING_CMDLETS, SHELLS_AND_SPAWNERS, NETWORK_CMDLETS, ALIAS_HIJACK_CMDLETS, WMI_CIM_CMDLETS, ARG_GATED_CMDLETS, NEVER_SUGGEST;
var init_dangerousCmdlets = __esm(() => {
  init_dangerousPatterns();
  init_parser5();
  FILEPATH_EXECUTION_CMDLETS = /* @__PURE__ */ new Set([
    "invoke-command",
    "start-job",
    "start-threadjob",
    "register-scheduledjob"
  ]), DANGEROUS_SCRIPT_BLOCK_CMDLETS = /* @__PURE__ */ new Set([
    "invoke-command",
    "invoke-expression",
    "start-job",
    "start-threadjob",
    "register-scheduledjob",
    "register-engineevent",
    "register-objectevent",
    "register-wmievent",
    "new-pssession",
    "enter-pssession"
  ]), MODULE_LOADING_CMDLETS = /* @__PURE__ */ new Set([
    "import-module",
    "ipmo",
    "install-module",
    "save-module",
    "update-module",
    "install-script",
    "save-script"
  ]), SHELLS_AND_SPAWNERS = [
    "pwsh",
    "powershell",
    "cmd",
    "bash",
    "wsl",
    "sh",
    "start-process",
    "start",
    "add-type",
    "new-object"
  ];
  NETWORK_CMDLETS = /* @__PURE__ */ new Set([
    "invoke-webrequest",
    "invoke-restmethod"
  ]), ALIAS_HIJACK_CMDLETS = /* @__PURE__ */ new Set([
    "set-alias",
    "sal",
    "new-alias",
    "nal",
    "set-variable",
    "sv",
    "new-variable",
    "nv"
  ]), WMI_CIM_CMDLETS = /* @__PURE__ */ new Set([
    "invoke-wmimethod",
    "iwmi",
    "invoke-cimmethod"
  ]), ARG_GATED_CMDLETS = /* @__PURE__ */ new Set([
    "select-object",
    "sort-object",
    "group-object",
    "where-object",
    "measure-object",
    "write-output",
    "write-host",
    "start-sleep",
    "format-table",
    "format-list",
    "format-wide",
    "format-custom",
    "out-string",
    "out-host",
    "ipconfig",
    "hostname",
    "route"
  ]), NEVER_SUGGEST = (() => {
    let core2 = /* @__PURE__ */ new Set([
      ...SHELLS_AND_SPAWNERS,
      ...FILEPATH_EXECUTION_CMDLETS,
      ...DANGEROUS_SCRIPT_BLOCK_CMDLETS,
      ...MODULE_LOADING_CMDLETS,
      ...NETWORK_CMDLETS,
      ...ALIAS_HIJACK_CMDLETS,
      ...WMI_CIM_CMDLETS,
      ...ARG_GATED_CMDLETS,
      "foreach-object",
      ...CROSS_PLATFORM_CODE_EXEC.filter((p4) => !p4.includes(" "))
    ]);
    return /* @__PURE__ */ new Set([...core2, ...aliasesOf(core2)]);
  })();
});
