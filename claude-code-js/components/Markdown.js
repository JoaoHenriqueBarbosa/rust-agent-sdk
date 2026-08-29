// Original: src/components/Markdown.tsx
function hasMarkdownSyntax(s2) {
  return MD_SYNTAX_RE.test(s2.length > 500 ? s2.slice(0, 500) : s2);
}
function cachedLexer(content) {
  if (!hasMarkdownSyntax(content))
    return [{
      type: "paragraph",
      raw: content,
      text: content,
      tokens: [{
        type: "text",
        raw: content,
        text: content
      }]
    }];
  let key2 = hashContent(content), hit = tokenCache.get(key2);
  if (hit)
    return tokenCache.delete(key2), tokenCache.set(key2, hit), hit;
  let tokens = marked.lexer(content);
  if (tokenCache.size >= TOKEN_CACHE_MAX) {
    let first = tokenCache.keys().next().value;
    if (first !== void 0)
      tokenCache.delete(first);
  }
  return tokenCache.set(key2, tokens), tokens;
}
function Markdown(props) {
  let $3 = import_compiler_runtime38.c(4);
  if (useSettings().syntaxHighlightingDisabled) {
    let t02;
    if ($3[0] !== props)
      t02 = /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(MarkdownBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this), $3[0] = props, $3[1] = t02;
    else
      t02 = $3[1];
    return t02;
  }
  let t0;
  if ($3[2] !== props)
    t0 = /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(import_react41.Suspense, {
      fallback: /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(MarkdownBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this),
      children: /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(MarkdownWithHighlight, {
        ...props
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = props, $3[3] = t0;
  else
    t0 = $3[3];
  return t0;
}
function MarkdownWithHighlight(props) {
  let $3 = import_compiler_runtime38.c(4), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = getCliHighlightPromise(), $3[0] = t0;
  else
    t0 = $3[0];
  let highlight = import_react41.use(t0), t1;
  if ($3[1] !== highlight || $3[2] !== props)
    t1 = /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(MarkdownBody, {
      ...props,
      highlight
    }, void 0, !1, void 0, this), $3[1] = highlight, $3[2] = props, $3[3] = t1;
  else
    t1 = $3[3];
  return t1;
}
function MarkdownBody(t0) {
  let $3 = import_compiler_runtime38.c(7), {
    children,
    dimColor,
    highlight
  } = t0, [theme] = useTheme();
  configureMarked();
  let elements;
  if ($3[0] !== children || $3[1] !== dimColor || $3[2] !== highlight || $3[3] !== theme) {
    let tokens = cachedLexer(stripPromptXMLTags(children));
    elements = [];
    let nonTableContent = "", flushNonTableContent = function() {
      if (nonTableContent)
        elements.push(/* @__PURE__ */ jsx_dev_runtime44.jsxDEV(Ansi, {
          dimColor,
          children: nonTableContent.trim()
        }, elements.length, !1, void 0, this)), nonTableContent = "";
    };
    for (let token of tokens)
      if (token.type === "table")
        flushNonTableContent(), elements.push(/* @__PURE__ */ jsx_dev_runtime44.jsxDEV(MarkdownTable, {
          token,
          highlight
        }, elements.length, !1, void 0, this));
      else
        nonTableContent = nonTableContent + formatToken(token, theme, 0, null, null, highlight);
    flushNonTableContent(), $3[0] = children, $3[1] = dimColor, $3[2] = highlight, $3[3] = theme, $3[4] = elements;
  } else
    elements = $3[4];
  let elements_0 = elements, t1;
  if ($3[5] !== elements_0)
    t1 = /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: elements_0
    }, void 0, !1, void 0, this), $3[5] = elements_0, $3[6] = t1;
  else
    t1 = $3[6];
  return t1;
}
function StreamingMarkdown({
  children
}) {
  configureMarked();
  let stripped = stripPromptXMLTags(children), stablePrefixRef = import_react41.useRef("");
  if (!stripped.startsWith(stablePrefixRef.current))
    stablePrefixRef.current = "";
  let boundary = stablePrefixRef.current.length, tokens = marked.lexer(stripped.substring(boundary)), lastContentIdx = tokens.length - 1;
  while (lastContentIdx >= 0 && tokens[lastContentIdx].type === "space")
    lastContentIdx--;
  let advance2 = 0;
  for (let i5 = 0;i5 < lastContentIdx; i5++)
    advance2 += tokens[i5].raw.length;
  if (advance2 > 0)
    stablePrefixRef.current = stripped.substring(0, boundary + advance2);
  let stablePrefix = stablePrefixRef.current, unstableSuffix = stripped.substring(stablePrefix.length);
  return /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    gap: 1,
    children: [
      stablePrefix && /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(Markdown, {
        children: stablePrefix
      }, void 0, !1, void 0, this),
      unstableSuffix && /* @__PURE__ */ jsx_dev_runtime44.jsxDEV(Markdown, {
        children: unstableSuffix
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_compiler_runtime38, import_react41, jsx_dev_runtime44, TOKEN_CACHE_MAX = 500, tokenCache, MD_SYNTAX_RE;
var init_Markdown = __esm(() => {
  init_marked_esm();
  init_useSettings();
  init_ink2();
  init_cliHighlight();
  init_markdown();
  init_messages3();
  init_MarkdownTable();
  import_compiler_runtime38 = __toESM(require_react_compiler_runtime_development(), 1), import_react41 = __toESM(require_react_development(), 1), jsx_dev_runtime44 = __toESM(require_react_jsx_dev_runtime_development(), 1), tokenCache = /* @__PURE__ */ new Map, MD_SYNTAX_RE = /[#*`|[>\-_~]|\n\n|^\d+\. |\n\d+\. /;
});
