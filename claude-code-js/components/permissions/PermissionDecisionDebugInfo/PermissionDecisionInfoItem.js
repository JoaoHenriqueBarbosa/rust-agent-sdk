// function: PermissionDecisionInfoItem
function PermissionDecisionInfoItem(t0) {
  let $3 = import_compiler_runtime294.c(10), {
    title,
    decisionReason
  } = t0, [theme2] = useTheme(), t1;
  if ($3[0] !== decisionReason || $3[1] !== theme2)
    t1 = function() {
      switch (decisionReason.type) {
        case "subcommandResults":
          return /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: Array.from(decisionReason.reasons.entries()).map((t22) => {
              let [subcommand, result] = t22, icon = result.behavior === "allow" ? color("success", theme2)(figures_default.tick) : color("error", theme2)(figures_default.cross);
              return /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                    children: [
                      icon,
                      " ",
                      subcommand
                    ]
                  }, void 0, !0, void 0, this),
                  result.decisionReason !== void 0 && result.decisionReason.type !== "subcommandResults" && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
                        dimColor: !0,
                        children: [
                          "  ",
                          "\u23BF",
                          "  "
                        ]
                      }, void 0, !0, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(Ansi, {
                        children: decisionReasonDisplayString(result.decisionReason)
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this),
                  result.behavior === "ask" && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(SuggestedRules, {
                    suggestions: result.suggestions
                  }, void 0, !1, void 0, this)
                ]
              }, subcommand, !0, void 0, this);
            })
          }, void 0, !1, void 0, this);
        default:
          return /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
            children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(Ansi, {
              children: decisionReasonDisplayString(decisionReason)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this);
      }
    }, $3[0] = decisionReason, $3[1] = theme2, $3[2] = t1;
  else
    t1 = $3[2];
  let formatDecisionReason = t1, t2;
  if ($3[3] !== title)
    t2 = title && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
      children: title
    }, void 0, !1, void 0, this), $3[3] = title, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== formatDecisionReason)
    t3 = formatDecisionReason(), $3[5] = formatDecisionReason, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t2 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t2, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  return t4;
}
