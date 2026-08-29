// Original: src/components/hooks/SelectEventMode.tsx
function SelectEventMode(t0) {
  let $3 = import_compiler_runtime242.c(23), {
    hookEventMetadata,
    hooksByEvent,
    totalHooksCount,
    restrictedByPolicy,
    onSelectEvent,
    onCancel
  } = t0, t1;
  if ($3[0] !== totalHooksCount)
    t1 = plural(totalHooksCount, "hook"), $3[0] = totalHooksCount, $3[1] = t1;
  else
    t1 = $3[1];
  let subtitle = `${totalHooksCount} ${t1} configured`, t2;
  if ($3[2] !== restrictedByPolicy)
    t2 = restrictedByPolicy && /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedText, {
          color: "suggestion",
          children: [
            figures_default.info,
            " Hooks Restricted by Policy"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = restrictedByPolicy, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.info,
          " This menu is read-only. To add or modify hooks, edit settings.json directly or ask Claude.",
          " ",
          /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(Link, {
            url: "https://code.claude.com/docs/en/hooks",
            children: "Learn more"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== onSelectEvent)
    t4 = (value) => {
      onSelectEvent(value);
    }, $3[5] = onSelectEvent, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== hookEventMetadata)
    t5 = Object.entries(hookEventMetadata), $3[7] = hookEventMetadata, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== hooksByEvent || $3[10] !== t5)
    t6 = t5.map((t72) => {
      let [name3, metadata] = t72, count4 = hooksByEvent[name3] || 0;
      return {
        label: count4 > 0 ? /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedText, {
          children: [
            name3,
            " ",
            /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedText, {
              color: "suggestion",
              children: [
                "(",
                count4,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this) : name3,
        value: name3,
        description: metadata.summary
      };
    }), $3[9] = hooksByEvent, $3[10] = t5, $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] !== onCancel || $3[13] !== t4 || $3[14] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(Select, {
        onChange: t4,
        onCancel,
        options: t6
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = onCancel, $3[13] = t4, $3[14] = t6, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== t2 || $3[17] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t2,
        t3,
        t7
      ]
    }, void 0, !0, void 0, this), $3[16] = t2, $3[17] = t7, $3[18] = t8;
  else
    t8 = $3[18];
  let t9;
  if ($3[19] !== onCancel || $3[20] !== subtitle || $3[21] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime308.jsxDEV(Dialog, {
      title: "Hooks",
      subtitle,
      onCancel,
      children: t8
    }, void 0, !1, void 0, this), $3[19] = onCancel, $3[20] = subtitle, $3[21] = t8, $3[22] = t9;
  else
    t9 = $3[22];
  return t9;
}
var import_compiler_runtime242, jsx_dev_runtime308;
var init_SelectEventMode = __esm(() => {
  init_figures();
  init_ink2();
  init_select();
  init_Dialog();
  import_compiler_runtime242 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime308 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
