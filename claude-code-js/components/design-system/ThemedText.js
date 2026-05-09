// Original: src/components/design-system/ThemedText.tsx
function resolveColor2(color2, theme) {
  if (!color2)
    return;
  if (color2.startsWith("rgb(") || color2.startsWith("#") || color2.startsWith("ansi256(") || color2.startsWith("ansi:"))
    return color2;
  return theme[color2];
}
function ThemedText(t0) {
  let $3 = import_compiler_runtime7.c(10), {
    color: color2,
    backgroundColor,
    dimColor: t1,
    bold: t2,
    italic: t3,
    underline: t4,
    strikethrough: t5,
    inverse: t6,
    wrap: t7,
    children
  } = t0, dimColor = t1 === void 0 ? !1 : t1, bold2 = t2 === void 0 ? !1 : t2, italic2 = t3 === void 0 ? !1 : t3, underline2 = t4 === void 0 ? !1 : t4, strikethrough2 = t5 === void 0 ? !1 : t5, inverse2 = t6 === void 0 ? !1 : t6, wrap = t7 === void 0 ? "wrap" : t7, [themeName] = useTheme(), theme = getTheme(themeName), hoverColor = import_react12.useContext(TextHoverColorContext), resolvedColor = !color2 && hoverColor ? resolveColor2(hoverColor, theme) : dimColor ? theme.inactive : resolveColor2(color2, theme), resolvedBackgroundColor = backgroundColor ? theme[backgroundColor] : void 0, t8;
  if ($3[0] !== bold2 || $3[1] !== children || $3[2] !== inverse2 || $3[3] !== italic2 || $3[4] !== resolvedBackgroundColor || $3[5] !== resolvedColor || $3[6] !== strikethrough2 || $3[7] !== underline2 || $3[8] !== wrap)
    t8 = /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(Text, {
      color: resolvedColor,
      backgroundColor: resolvedBackgroundColor,
      bold: bold2,
      italic: italic2,
      underline: underline2,
      strikethrough: strikethrough2,
      inverse: inverse2,
      wrap,
      children
    }, void 0, !1, void 0, this), $3[0] = bold2, $3[1] = children, $3[2] = inverse2, $3[3] = italic2, $3[4] = resolvedBackgroundColor, $3[5] = resolvedColor, $3[6] = strikethrough2, $3[7] = underline2, $3[8] = wrap, $3[9] = t8;
  else
    t8 = $3[9];
  return t8;
}
var import_compiler_runtime7, import_react12, jsx_dev_runtime10, TextHoverColorContext;
var init_ThemedText = __esm(() => {
  init_Text();
  init_theme();
  init_ThemeProvider();
  import_compiler_runtime7 = __toESM(require_react_compiler_runtime_development(), 1), import_react12 = __toESM(require_react_development(), 1), jsx_dev_runtime10 = __toESM(require_react_jsx_dev_runtime_development(), 1), TextHoverColorContext = import_react12.default.createContext(void 0);
});

// node_modules/supports-hyperlinks/index.js
var require_supports_hyperlinks = __commonJS((exports, module) => {
  var supportsColor2 = require_supports_color(), hasFlag2 = require_has_flag();
  function parseVersion(versionString) {
    if (/^\d{3,4}$/.test(versionString)) {
      let m4 = /(\d{1,2})(\d{2})/.exec(versionString) || [];
      return {
        major: 0,
        minor: parseInt(m4[1], 10),
        patch: parseInt(m4[2], 10)
      };
    }
    let versions2 = (versionString || "").split(".").map((n5) => parseInt(n5, 10));
    return {
      major: versions2[0],
      minor: versions2[1],
      patch: versions2[2]
    };
  }
  function supportsHyperlink(stream10) {
    let {
      CI,
      FORCE_HYPERLINK,
      NETLIFY,
      TEAMCITY_VERSION,
      TERM_PROGRAM,
      TERM_PROGRAM_VERSION,
      VTE_VERSION,
      TERM
    } = process.env;
    if (FORCE_HYPERLINK)
      return !(FORCE_HYPERLINK.length > 0 && parseInt(FORCE_HYPERLINK, 10) === 0);
    if (hasFlag2("no-hyperlink") || hasFlag2("no-hyperlinks") || hasFlag2("hyperlink=false") || hasFlag2("hyperlink=never"))
      return !1;
    if (hasFlag2("hyperlink=true") || hasFlag2("hyperlink=always"))
      return !0;
    if (NETLIFY)
      return !0;
    if (!supportsColor2.supportsColor(stream10))
      return !1;
    if (stream10 && !stream10.isTTY)
      return !1;
    if ("WT_SESSION" in process.env)
      return !0;
    if (process.platform === "win32")
      return !1;
    if (CI)
      return !1;
    if (TEAMCITY_VERSION)
      return !1;
    if (TERM_PROGRAM) {
      let version5 = parseVersion(TERM_PROGRAM_VERSION || "");
      switch (TERM_PROGRAM) {
        case "iTerm.app":
          if (version5.major === 3)
            return version5.minor >= 1;
          return version5.major > 3;
        case "WezTerm":
          return version5.major >= 20200620;
        case "vscode":
          return version5.major > 1 || version5.major === 1 && version5.minor >= 72;
        case "ghostty":
          return !0;
      }
    }
    if (VTE_VERSION) {
      if (VTE_VERSION === "0.50.0")
        return !1;
      let version5 = parseVersion(VTE_VERSION);
      return version5.major > 0 || version5.minor >= 50;
    }
    switch (TERM) {
      case "alacritty":
        return !0;
    }
    return !1;
  }
  module.exports = {
    supportsHyperlink,
    stdout: supportsHyperlink(process.stdout),
    stderr: supportsHyperlink(process.stderr)
  };
});
