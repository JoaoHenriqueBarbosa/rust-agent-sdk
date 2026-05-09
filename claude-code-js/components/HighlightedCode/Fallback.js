// Original: src/components/HighlightedCode/Fallback.tsx
import { extname as extname8 } from "path";
function cachedHighlight(hl, code, language) {
  let key2 = hashPair(language, code), hit = hlCache.get(key2);
  if (hit !== void 0)
    return hlCache.delete(key2), hlCache.set(key2, hit), hit;
  let out = hl.highlight(code, {
    language
  });
  if (hlCache.size >= HL_CACHE_MAX) {
    let first = hlCache.keys().next().value;
    if (first !== void 0)
      hlCache.delete(first);
  }
  return hlCache.set(key2, out), out;
}
function HighlightedCodeFallback(t0) {
  let $3 = import_compiler_runtime108.c(20), {
    code,
    filePath,
    dim: t1,
    skipColoring: t2
  } = t0, dim2 = t1 === void 0 ? !1 : t1, skipColoring = t2 === void 0 ? !1 : t2, t3;
  if ($3[0] !== code)
    t3 = convertLeadingTabsToSpaces(code), $3[0] = code, $3[1] = t3;
  else
    t3 = $3[1];
  let codeWithSpaces = t3;
  if (skipColoring) {
    let t42;
    if ($3[2] !== codeWithSpaces)
      t42 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(Ansi, {
        children: codeWithSpaces
      }, void 0, !1, void 0, this), $3[2] = codeWithSpaces, $3[3] = t42;
    else
      t42 = $3[3];
    let t52;
    if ($3[4] !== dim2 || $3[5] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(ThemedText, {
        dimColor: dim2,
        children: t42
      }, void 0, !1, void 0, this), $3[4] = dim2, $3[5] = t42, $3[6] = t52;
    else
      t52 = $3[6];
    return t52;
  }
  let t4;
  if ($3[7] !== filePath)
    t4 = extname8(filePath).slice(1), $3[7] = filePath, $3[8] = t4;
  else
    t4 = $3[8];
  let language = t4, t5;
  if ($3[9] !== codeWithSpaces)
    t5 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(Ansi, {
      children: codeWithSpaces
    }, void 0, !1, void 0, this), $3[9] = codeWithSpaces, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== codeWithSpaces || $3[12] !== language)
    t6 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(Highlighted, {
      codeWithSpaces,
      language
    }, void 0, !1, void 0, this), $3[11] = codeWithSpaces, $3[12] = language, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== t5 || $3[15] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(import_react76.Suspense, {
      fallback: t5,
      children: t6
    }, void 0, !1, void 0, this), $3[14] = t5, $3[15] = t6, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== dim2 || $3[18] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(ThemedText, {
      dimColor: dim2,
      children: t7
    }, void 0, !1, void 0, this), $3[17] = dim2, $3[18] = t7, $3[19] = t8;
  else
    t8 = $3[19];
  return t8;
}
function Highlighted(t0) {
  let $3 = import_compiler_runtime108.c(10), {
    codeWithSpaces,
    language
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getCliHighlightPromise(), $3[0] = t1;
  else
    t1 = $3[0];
  let hl = import_react76.use(t1), t2;
  if ($3[1] !== codeWithSpaces || $3[2] !== hl || $3[3] !== language) {
    bb0: {
      if (!hl) {
        t2 = codeWithSpaces;
        break bb0;
      }
      let highlightLang = "markdown";
      if (language)
        if (hl.supportsLanguage(language))
          highlightLang = language;
        else
          logForDebugging(`Language not supported while highlighting code, falling back to markdown: ${language}`);
      try {
        t2 = cachedHighlight(hl, codeWithSpaces, highlightLang);
      } catch (t32) {
        let e = t32;
        if (e instanceof Error && e.message.includes("Unknown language")) {
          logForDebugging(`Language not supported while highlighting code, falling back to markdown: ${e}`);
          let t4;
          if ($3[5] !== codeWithSpaces || $3[6] !== hl)
            t4 = cachedHighlight(hl, codeWithSpaces, "markdown"), $3[5] = codeWithSpaces, $3[6] = hl, $3[7] = t4;
          else
            t4 = $3[7];
          t2 = t4;
          break bb0;
        }
        t2 = codeWithSpaces;
      }
    }
    $3[1] = codeWithSpaces, $3[2] = hl, $3[3] = language, $3[4] = t2;
  } else
    t2 = $3[4];
  let out = t2, t3;
  if ($3[8] !== out)
    t3 = /* @__PURE__ */ jsx_dev_runtime125.jsxDEV(Ansi, {
      children: out
    }, void 0, !1, void 0, this), $3[8] = out, $3[9] = t3;
  else
    t3 = $3[9];
  return t3;
}
var import_compiler_runtime108, import_react76, jsx_dev_runtime125, HL_CACHE_MAX = 500, hlCache;
var init_Fallback = __esm(() => {
  init_ink2();
  init_cliHighlight();
  init_debug();
  init_file();
  import_compiler_runtime108 = __toESM(require_react_compiler_runtime_development(), 1), import_react76 = __toESM(require_react_development(), 1), jsx_dev_runtime125 = __toESM(require_react_jsx_dev_runtime_development(), 1), hlCache = /* @__PURE__ */ new Map;
});
