// Original: src/components/permissions/rules/PermissionRuleDescription.tsx
function PermissionRuleDescription(t0) {
  let $3 = import_compiler_runtime231.c(9), {
    ruleValue
  } = t0;
  switch (ruleValue.toolName) {
    case BashTool.name:
      if (ruleValue.ruleContent)
        if (ruleValue.ruleContent.endsWith(":*")) {
          let t1;
          if ($3[0] !== ruleValue.ruleContent)
            t1 = ruleValue.ruleContent.slice(0, -2), $3[0] = ruleValue.ruleContent, $3[1] = t1;
          else
            t1 = $3[1];
          let t2;
          if ($3[2] !== t1)
            t2 = /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Any Bash command starting with",
                " ",
                /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
                  bold: !0,
                  children: t1
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this), $3[2] = t1, $3[3] = t2;
          else
            t2 = $3[3];
          return t2;
        } else {
          let t1;
          if ($3[4] !== ruleValue.ruleContent)
            t1 = /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "The Bash command ",
                /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
                  bold: !0,
                  children: ruleValue.ruleContent
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this), $3[4] = ruleValue.ruleContent, $3[5] = t1;
          else
            t1 = $3[5];
          return t1;
        }
      else {
        let t1;
        if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
          t1 = /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Any Bash command"
          }, void 0, !1, void 0, this), $3[6] = t1;
        else
          t1 = $3[6];
        return t1;
      }
    default:
      if (!ruleValue.ruleContent) {
        let t1;
        if ($3[7] !== ruleValue.toolName)
          t1 = /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Any use of the ",
              /* @__PURE__ */ jsx_dev_runtime293.jsxDEV(ThemedText, {
                bold: !0,
                children: ruleValue.toolName
              }, void 0, !1, void 0, this),
              " tool"
            ]
          }, void 0, !0, void 0, this), $3[7] = ruleValue.toolName, $3[8] = t1;
        else
          t1 = $3[8];
        return t1;
      } else
        return null;
  }
}
var import_compiler_runtime231, jsx_dev_runtime293;
var init_PermissionRuleDescription = __esm(() => {
  init_ink2();
  init_BashTool();
  import_compiler_runtime231 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime293 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
