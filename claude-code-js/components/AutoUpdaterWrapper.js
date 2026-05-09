// Original: src/components/AutoUpdaterWrapper.tsx
function AutoUpdaterWrapper(t0) {
  let $3 = import_compiler_runtime315.c(17), {
    isUpdating,
    onChangeIsUpdating,
    onAutoUpdaterResult,
    autoUpdaterResult,
    showSuccessMessage,
    verbose
  } = t0, [useNativeInstaller, setUseNativeInstaller] = React130.useState(null), [isPackageManager, setIsPackageManager] = React130.useState(null), t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      (async function() {
        let installationType = await getCurrentInstallationType();
        logForDebugging(`AutoUpdaterWrapper: Installation type: ${installationType}`), setUseNativeInstaller(installationType === "native"), setIsPackageManager(installationType === "package-manager");
      })();
    }, t2 = [], $3[0] = t1, $3[1] = t2;
  else
    t1 = $3[0], t2 = $3[1];
  if (React130.useEffect(t1, t2), useNativeInstaller === null || isPackageManager === null)
    return null;
  if (isPackageManager) {
    let t32;
    if ($3[2] !== autoUpdaterResult || $3[3] !== isUpdating || $3[4] !== onAutoUpdaterResult || $3[5] !== onChangeIsUpdating || $3[6] !== showSuccessMessage || $3[7] !== verbose)
      t32 = /* @__PURE__ */ jsx_dev_runtime406.jsxDEV(PackageManagerAutoUpdater, {
        verbose,
        onAutoUpdaterResult,
        autoUpdaterResult,
        isUpdating,
        onChangeIsUpdating,
        showSuccessMessage
      }, void 0, !1, void 0, this), $3[2] = autoUpdaterResult, $3[3] = isUpdating, $3[4] = onAutoUpdaterResult, $3[5] = onChangeIsUpdating, $3[6] = showSuccessMessage, $3[7] = verbose, $3[8] = t32;
    else
      t32 = $3[8];
    return t32;
  }
  let Updater = useNativeInstaller ? NativeAutoUpdater : AutoUpdater, t3;
  if ($3[9] !== Updater || $3[10] !== autoUpdaterResult || $3[11] !== isUpdating || $3[12] !== onAutoUpdaterResult || $3[13] !== onChangeIsUpdating || $3[14] !== showSuccessMessage || $3[15] !== verbose)
    t3 = /* @__PURE__ */ jsx_dev_runtime406.jsxDEV(Updater, {
      verbose,
      onAutoUpdaterResult,
      autoUpdaterResult,
      isUpdating,
      onChangeIsUpdating,
      showSuccessMessage
    }, void 0, !1, void 0, this), $3[9] = Updater, $3[10] = autoUpdaterResult, $3[11] = isUpdating, $3[12] = onAutoUpdaterResult, $3[13] = onChangeIsUpdating, $3[14] = showSuccessMessage, $3[15] = verbose, $3[16] = t3;
  else
    t3 = $3[16];
  return t3;
}
var import_compiler_runtime315, React130, jsx_dev_runtime406;
var init_AutoUpdaterWrapper = __esm(() => {
  init_debug();
  init_doctorDiagnostic();
  init_AutoUpdater();
  init_NativeAutoUpdater();
  init_PackageManagerAutoUpdater();
  import_compiler_runtime315 = __toESM(require_react_compiler_runtime_development(), 1), React130 = __toESM(require_react_development(), 1), jsx_dev_runtime406 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
