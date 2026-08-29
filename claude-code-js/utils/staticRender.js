// Original: src/utils/staticRender.tsx
import { PassThrough as PassThrough4 } from "stream";
function RenderOnceAndExit(t0) {
  let $3 = import_compiler_runtime149.c(5), {
    children
  } = t0, {
    exit
  } = use_app_default(), t1, t2;
  if ($3[0] !== exit)
    t1 = () => {
      let timer = setTimeout(exit, 0);
      return () => clearTimeout(timer);
    }, t2 = [exit], $3[0] = exit, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react108.useLayoutEffect(t1, t2);
  let t3;
  if ($3[3] !== children)
    t3 = /* @__PURE__ */ jsx_dev_runtime187.jsxDEV(jsx_dev_runtime187.Fragment, {
      children
    }, void 0, !1, void 0, this), $3[3] = children, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function extractFirstFrame(output) {
  let startIndex = output.indexOf(SYNC_START);
  if (startIndex === -1)
    return output;
  let contentStart = startIndex + SYNC_START.length, endIndex = output.indexOf(SYNC_END, contentStart);
  if (endIndex === -1)
    return output;
  return output.slice(contentStart, endIndex);
}
function renderToAnsiString(node2, columns) {
  return new Promise(async (resolve41) => {
    let output = "", stream10 = new PassThrough4;
    if (columns !== void 0)
      stream10.columns = columns;
    stream10.on("data", (chunk) => {
      output += chunk.toString();
    }), await (await render(/* @__PURE__ */ jsx_dev_runtime187.jsxDEV(RenderOnceAndExit, {
      children: node2
    }, void 0, !1, void 0, this), {
      stdout: stream10,
      patchConsole: !1
    })).waitUntilExit(), await resolve41(extractFirstFrame(output));
  });
}
async function renderToString(node2, columns) {
  let output = await renderToAnsiString(node2, columns);
  return stripAnsi(output);
}
var import_compiler_runtime149, import_react108, jsx_dev_runtime187, SYNC_START = "\x1B[?2026h", SYNC_END = "\x1B[?2026l";
var init_staticRender = __esm(() => {
  init_strip_ansi();
  init_ink2();
  import_compiler_runtime149 = __toESM(require_react_compiler_runtime_development(), 1), import_react108 = __toESM(require_react_development(), 1), jsx_dev_runtime187 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
