// Original: src/components/messages/UserBashOutputMessage.tsx
function UserBashOutputMessage(t0) {
  let $3 = import_compiler_runtime73.c(10), {
    content,
    verbose
  } = t0, t1;
  if ($3[0] !== content) {
    let rawStdout = extractTag(content, "bash-stdout") ?? "";
    t1 = extractTag(rawStdout, "persisted-output") ?? rawStdout, $3[0] = content, $3[1] = t1;
  } else
    t1 = $3[1];
  let stdout = t1, t2;
  if ($3[2] !== content)
    t2 = extractTag(content, "bash-stderr") ?? "", $3[2] = content, $3[3] = t2;
  else
    t2 = $3[3];
  let stderr = t2, t3;
  if ($3[4] !== stderr || $3[5] !== stdout)
    t3 = {
      stdout,
      stderr
    }, $3[4] = stderr, $3[5] = stdout, $3[6] = t3;
  else
    t3 = $3[6];
  let t4 = !!verbose, t5;
  if ($3[7] !== t3 || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime83.jsxDEV(BashToolResultMessage, {
      content: t3,
      verbose: t4
    }, void 0, !1, void 0, this), $3[7] = t3, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
var import_compiler_runtime73, jsx_dev_runtime83;
var init_UserBashOutputMessage = __esm(() => {
  init_BashToolResultMessage();
  init_messages3();
  import_compiler_runtime73 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime83 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
