// function: SuggestionDisplay
function SuggestionDisplay(t0) {
  let $3 = import_compiler_runtime294.c(22), {
    suggestions,
    width
  } = t0;
  if (!suggestions || suggestions.length === 0) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Suggestions "
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    let t22;
    if ($3[1] !== width)
      t22 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
        justifyContent: "flex-end",
        minWidth: width,
        children: t12
      }, void 0, !1, void 0, this), $3[1] = width, $3[2] = t22;
    else
      t22 = $3[2];
    let t3;
    if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
      t3 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        children: "None"
      }, void 0, !1, void 0, this), $3[3] = t3;
    else
      t3 = $3[3];
    let t4;
    if ($3[4] !== t22)
      t4 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          t22,
          t3
        ]
      }, void 0, !0, void 0, this), $3[4] = t22, $3[5] = t4;
    else
      t4 = $3[5];
    return t4;
  }
  let t1, t2;
  if ($3[6] !== suggestions || $3[7] !== width) {
    t2 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let rules2 = extractRules(suggestions), directories = extractDirectories(suggestions), mode = extractMode(suggestions);
      if (rules2.length === 0 && directories.length === 0 && !mode) {
        let t32;
        if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
          t32 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Suggestion "
          }, void 0, !1, void 0, this), $3[10] = t32;
        else
          t32 = $3[10];
        let t42;
        if ($3[11] !== width)
          t42 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            justifyContent: "flex-end",
            minWidth: width,
            children: t32
          }, void 0, !1, void 0, this), $3[11] = width, $3[12] = t42;
        else
          t42 = $3[12];
        let t52;
        if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
          t52 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
            children: "None"
          }, void 0, !1, void 0, this), $3[13] = t52;
        else
          t52 = $3[13];
        let t62;
        if ($3[14] !== t42)
          t62 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              t42,
              t52
            ]
          }, void 0, !0, void 0, this), $3[14] = t42, $3[15] = t62;
        else
          t62 = $3[15];
        t2 = t62;
        break bb0;
      }
      let t3;
      if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
        t3 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Suggestions "
        }, void 0, !1, void 0, this), $3[16] = t3;
      else
        t3 = $3[16];
      let t4;
      if ($3[17] !== width)
        t4 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
          justifyContent: "flex-end",
          minWidth: width,
          children: t3
        }, void 0, !1, void 0, this), $3[17] = width, $3[18] = t4;
      else
        t4 = $3[18];
      let t5;
      if ($3[19] === Symbol.for("react.memo_cache_sentinel"))
        t5 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this), $3[19] = t5;
      else
        t5 = $3[19];
      let t6;
      if ($3[20] !== t4)
        t6 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            t4,
            t5
          ]
        }, void 0, !0, void 0, this), $3[20] = t4, $3[21] = t6;
      else
        t6 = $3[21];
      t1 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t6,
          rules2.length > 0 && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                justifyContent: "flex-end",
                minWidth: width,
                children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " Rules "
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: rules2.map(_temp277)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          directories.length > 0 && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                justifyContent: "flex-end",
                minWidth: width,
                children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " Directories "
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: directories.map(_temp351)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          mode && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                justifyContent: "flex-end",
                minWidth: width,
                children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " Mode "
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                children: permissionModeTitle(mode)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
    $3[6] = suggestions, $3[7] = width, $3[8] = t1, $3[9] = t2;
  } else
    t1 = $3[8], t2 = $3[9];
  if (t2 !== Symbol.for("react.early_return_sentinel"))
    return t2;
  return t1;
}
