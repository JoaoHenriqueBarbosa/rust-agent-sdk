// Original: src/commands/plugin/ValidatePlugin.tsx
function ValidatePlugin(t0) {
  let $3 = import_compiler_runtime192.c(5), {
    onComplete,
    path: path25
  } = t0, t1, t2;
  if ($3[0] !== onComplete || $3[1] !== path25)
    t1 = () => {
      (async function() {
        if (!path25) {
          onComplete(`Usage: /plugin validate <path>

Validate a plugin or marketplace manifest file or directory.

Examples:
  /plugin validate .claude-plugin/plugin.json
  /plugin validate /path/to/plugin-directory
  /plugin validate .

When given a directory, automatically validates .claude-plugin/marketplace.json
or .claude-plugin/plugin.json (prefers marketplace if both exist).

Or from the command line:
  claude plugin validate <path>`);
          return;
        }
        try {
          let result = await validateManifest3(path25), output = "";
          if (output = output + `Validating ${result.fileType} manifest: ${result.filePath}

`, result.errors.length > 0)
            output = output + `${figures_default.cross} Found ${result.errors.length} ${plural(result.errors.length, "error")}:

`, result.errors.forEach((error_0) => {
              output = output + `  ${figures_default.pointer} ${error_0.path}: ${error_0.message}
`;
            }), output = output + `
`;
          if (result.warnings.length > 0)
            output = output + `${figures_default.warning} Found ${result.warnings.length} ${plural(result.warnings.length, "warning")}:

`, result.warnings.forEach((warning) => {
              output = output + `  ${figures_default.pointer} ${warning.path}: ${warning.message}
`;
            }), output = output + `
`;
          if (result.success) {
            if (result.warnings.length > 0)
              output = output + `${figures_default.tick} Validation passed with warnings
`;
            else
              output = output + `${figures_default.tick} Validation passed
`;
            process.exitCode = 0;
          } else
            output = output + `${figures_default.cross} Validation failed
`, process.exitCode = 1;
          onComplete(output);
        } catch (t32) {
          let error44 = t32;
          process.exitCode = 2, logError2(error44), onComplete(`${figures_default.cross} Unexpected error during validation: ${errorMessage(error44)}`);
        }
      })();
    }, t2 = [onComplete, path25], $3[0] = onComplete, $3[1] = path25, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  import_react138.useEffect(t1, t2);
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime243.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime243.jsxDEV(ThemedText, {
        children: "Running validation..."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
var import_compiler_runtime192, import_react138, jsx_dev_runtime243;
var init_ValidatePlugin = __esm(() => {
  init_figures();
  init_ink2();
  init_errors();
  init_log3();
  init_validatePlugin();
  import_compiler_runtime192 = __toESM(require_react_compiler_runtime_development(), 1), import_react138 = __toESM(require_react_development(), 1), jsx_dev_runtime243 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
