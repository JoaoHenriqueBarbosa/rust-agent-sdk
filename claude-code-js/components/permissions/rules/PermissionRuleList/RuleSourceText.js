// function: RuleSourceText
function RuleSourceText(t0) {
  let $3 = import_compiler_runtime237.c(4), {
    rule
  } = t0, t1;
  if ($3[0] !== rule.source)
    t1 = permissionRuleSourceDisplayString(rule.source), $3[0] = rule.source, $3[1] = t1;
  else
    t1 = $3[1];
  let t2 = `From ${t1}`, t3;
  if ($3[2] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t2
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  return t3;
}
