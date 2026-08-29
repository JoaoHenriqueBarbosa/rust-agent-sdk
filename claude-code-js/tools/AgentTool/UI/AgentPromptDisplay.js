// function: AgentPromptDisplay
function AgentPromptDisplay(t0) {
  let $3 = import_compiler_runtime104.c(3), {
    prompt,
    dim: t1
  } = t0, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
      color: "success",
      bold: !0,
      children: "Prompt:"
    }, void 0, !1, void 0, this), $3[0] = t2;
  else
    t2 = $3[0];
  let t3;
  if ($3[1] !== prompt)
    t3 = /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t2,
        /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
          paddingLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(Markdown, {
            children: prompt
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = prompt, $3[2] = t3;
  else
    t3 = $3[2];
  return t3;
}
