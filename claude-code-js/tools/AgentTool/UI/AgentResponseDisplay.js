// function: AgentResponseDisplay
function AgentResponseDisplay(t0) {
  let $3 = import_compiler_runtime104.c(5), {
    content
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
      color: "success",
      bold: !0,
      children: "Response:"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== content)
    t2 = content.map(_temp30), $3[1] = content, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
