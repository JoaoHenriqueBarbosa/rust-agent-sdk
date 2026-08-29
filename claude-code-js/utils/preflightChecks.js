// Original: src/utils/preflightChecks.tsx
async function checkEndpoints() {
  try {
    let oauthConfig = getOauthConfig(), tokenUrl = new URL(oauthConfig.TOKEN_URL), endpoints7 = [`${oauthConfig.BASE_API_URL}/api/hello`, `${tokenUrl.origin}/v1/oauth/hello`], checkEndpoint = async (url3) => {
      try {
        let response7 = await axios_default.get(url3, {
          headers: {
            "User-Agent": getUserAgent()
          }
        });
        if (response7.status !== 200)
          return {
            success: !1,
            error: `Failed to connect to ${new URL(url3).hostname}: Status ${response7.status}`
          };
        return {
          success: !0
        };
      } catch (error44) {
        let hostname2 = new URL(url3).hostname, sslHint = getSSLErrorHint(error44);
        return {
          success: !1,
          error: `Failed to connect to ${hostname2}: ${error44 instanceof Error ? error44.code || error44.message : String(error44)}`,
          sslHint: sslHint ?? void 0
        };
      }
    }, failedResult = (await Promise.all(endpoints7.map(checkEndpoint))).find((result) => !result.success);
    if (failedResult)
      logEvent("tengu_preflight_check_failed", {
        isConnectivityError: !1,
        hasErrorMessage: !!failedResult.error,
        isSSLError: !!failedResult.sslHint
      });
    return failedResult || {
      success: !0
    };
  } catch (error44) {
    return logError2(error44), logEvent("tengu_preflight_check_failed", {
      isConnectivityError: !0
    }), {
      success: !1,
      error: `Connectivity check error: ${error44 instanceof Error ? error44.code || error44.message : String(error44)}`
    };
  }
}
function PreflightStep(t0) {
  let $3 = import_compiler_runtime364.c(12), {
    onSuccess
  } = t0, [result, setResult] = import_react305.useState(null), [isChecking, setIsChecking] = import_react305.useState(!0), showSpinner = useTimeout(1000) && isChecking, t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      (async function() {
        let checkResult = await checkEndpoints();
        setResult(checkResult), setIsChecking(!1);
      })();
    }, t2 = [], $3[0] = t1, $3[1] = t2;
  else
    t1 = $3[0], t2 = $3[1];
  import_react305.useEffect(t1, t2);
  let t3, t4;
  if ($3[2] !== onSuccess || $3[3] !== result)
    t3 = () => {
      if (result?.success)
        onSuccess();
      else if (result && !result.success) {
        let timer = setTimeout(_temp302, 100);
        return () => clearTimeout(timer);
      }
    }, t4 = [result, onSuccess], $3[2] = onSuccess, $3[3] = result, $3[4] = t3, $3[5] = t4;
  else
    t3 = $3[4], t4 = $3[5];
  import_react305.useEffect(t3, t4);
  let t5;
  if ($3[6] !== isChecking || $3[7] !== result || $3[8] !== showSpinner)
    t5 = isChecking && showSpinner ? /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedBox_default, {
      paddingLeft: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
          children: "Checking connectivity..."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : !result?.success && !isChecking && /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
          color: "error",
          children: "Unable to connect to Anthropic services"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
          color: "error",
          children: result?.error
        }, void 0, !1, void 0, this),
        result?.sslHint ? /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
              children: result.sslHint
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
              color: "suggestion",
              children: "See https://code.claude.com/docs/en/network-config"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
              children: "Please check your internet connection and network settings."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
              children: [
                "Note: Claude Code might not be available in your country. Check supported countries at",
                " ",
                /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedText, {
                  color: "suggestion",
                  children: "https://anthropic.com/supported-countries"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = isChecking, $3[7] = result, $3[8] = showSpinner, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime464.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      paddingLeft: 1,
      children: t5
    }, void 0, !1, void 0, this), $3[10] = t5, $3[11] = t6;
  else
    t6 = $3[11];
  return t6;
}
function _temp302() {
  return process.exit(1);
}
var import_compiler_runtime364, import_react305, jsx_dev_runtime464;
var init_preflightChecks = __esm(() => {
  init_axios2();
  init_Spinner2();
  init_oauth();
  init_useTimeout();
  init_ink2();
  init_errorUtils();
  init_http6();
  init_log3();
  import_compiler_runtime364 = __toESM(require_react_compiler_runtime_development(), 1), import_react305 = __toESM(require_react_development(), 1), jsx_dev_runtime464 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
