// Original: src/tools/PowerShellTool/commonParameters.ts
var COMMON_SWITCHES, COMMON_VALUE_PARAMS, COMMON_PARAMETERS;
var init_commonParameters = __esm(() => {
  COMMON_SWITCHES = ["-verbose", "-debug"], COMMON_VALUE_PARAMS = [
    "-erroraction",
    "-warningaction",
    "-informationaction",
    "-progressaction",
    "-errorvariable",
    "-warningvariable",
    "-informationvariable",
    "-outvariable",
    "-outbuffer",
    "-pipelinevariable"
  ], COMMON_PARAMETERS = /* @__PURE__ */ new Set([
    ...COMMON_SWITCHES,
    ...COMMON_VALUE_PARAMS
  ]);
});
