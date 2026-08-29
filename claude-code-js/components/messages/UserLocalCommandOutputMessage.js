// Original: src/components/messages/UserLocalCommandOutputMessage.tsx
function UserLocalCommandOutputMessage(t0) {
  let $3 = import_compiler_runtime75.c(4), {
    content
  } = t0, lines2, t1;
  if ($3[0] !== content) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let stdout = extractTag(content, "local-command-stdout"), stderr = extractTag(content, "local-command-stderr");
      if (!stdout && !stderr) {
        let t2;
        if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
          t2 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(MessageResponse, {
            children: /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
              dimColor: !0,
              children: NO_CONTENT_MESSAGE
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this), $3[3] = t2;
        else
          t2 = $3[3];
        t1 = t2;
        break bb0;
      }
      if (lines2 = [], stdout?.trim())
        lines2.push(/* @__PURE__ */ jsx_dev_runtime85.jsxDEV(IndentedContent, {
          children: stdout.trim()
        }, "stdout", !1, void 0, this));
      if (stderr?.trim())
        lines2.push(/* @__PURE__ */ jsx_dev_runtime85.jsxDEV(IndentedContent, {
          children: stderr.trim()
        }, "stderr", !1, void 0, this));
    }
    $3[0] = content, $3[1] = lines2, $3[2] = t1;
  } else
    lines2 = $3[1], t1 = $3[2];
  if (t1 !== Symbol.for("react.early_return_sentinel"))
    return t1;
  return lines2;
}
function IndentedContent(t0) {
  let $3 = import_compiler_runtime75.c(5), {
    children
  } = t0;
  if (children.startsWith(`${DIAMOND_OPEN} `) || children.startsWith(`${DIAMOND_FILLED} `)) {
    let t12;
    if ($3[0] !== children)
      t12 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(CloudLaunchContent, {
        children
      }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "  \u23BF  "
    }, void 0, !1, void 0, this), $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== children)
    t2 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t1,
        /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          flexGrow: 1,
          children: /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(Markdown, {
            children
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = children, $3[4] = t2;
  else
    t2 = $3[4];
  return t2;
}
function CloudLaunchContent(t0) {
  let $3 = import_compiler_runtime75.c(19), {
    children
  } = t0, diamond = children[0], label, rest, t1;
  if ($3[0] !== children) {
    let nl = children.indexOf(`
`), header = nl === -1 ? children.slice(2) : children.slice(2, nl);
    rest = nl === -1 ? "" : children.slice(nl + 1).trim();
    let sep13 = header.indexOf(" \xB7 ");
    label = sep13 === -1 ? header : header.slice(0, sep13), t1 = sep13 === -1 ? "" : header.slice(sep13), $3[0] = children, $3[1] = label, $3[2] = rest, $3[3] = t1;
  } else
    label = $3[1], rest = $3[2], t1 = $3[3];
  let suffix = t1, t2;
  if ($3[4] !== diamond)
    t2 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
      color: "background",
      children: [
        diamond,
        " "
      ]
    }, void 0, !0, void 0, this), $3[4] = diamond, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== label)
    t3 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
      bold: !0,
      children: label
    }, void 0, !1, void 0, this), $3[6] = label, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== suffix)
    t4 = suffix && /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
      dimColor: !0,
      children: suffix
    }, void 0, !1, void 0, this), $3[8] = suffix, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== t2 || $3[11] !== t3 || $3[12] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
      children: [
        t2,
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[10] = t2, $3[11] = t3, $3[12] = t4, $3[13] = t5;
  else
    t5 = $3[13];
  let t6;
  if ($3[14] !== rest)
    t6 = rest && /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "  \u23BF  "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedText, {
          dimColor: !0,
          children: rest
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = rest, $3[15] = t6;
  else
    t6 = $3[15];
  let t7;
  if ($3[16] !== t5 || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime85.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[16] = t5, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  return t7;
}
var import_compiler_runtime75, jsx_dev_runtime85;
var init_UserLocalCommandOutputMessage = __esm(() => {
  init_figures2();
  init_ink2();
  init_messages3();
  init_Markdown();
  init_MessageResponse();
  import_compiler_runtime75 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime85 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
