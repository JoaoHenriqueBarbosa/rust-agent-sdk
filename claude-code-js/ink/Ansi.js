// Original: src/ink/Ansi.tsx
function parseToSpans(input) {
  let actions = new Parser().feed(input), spans = [], currentHyperlink;
  for (let action of actions) {
    if (action.type === "link") {
      if (action.action.type === "start")
        currentHyperlink = action.action.url;
      else
        currentHyperlink = void 0;
      continue;
    }
    if (action.type === "text") {
      let text = action.graphemes.map((g) => g.value).join("");
      if (!text)
        continue;
      let props = textStyleToSpanProps(action.style);
      if (currentHyperlink)
        props.hyperlink = currentHyperlink;
      let lastSpan = spans[spans.length - 1];
      if (lastSpan && propsEqual(lastSpan.props, props))
        lastSpan.text += text;
      else
        spans.push({
          text,
          props
        });
    }
  }
  return spans;
}
function textStyleToSpanProps(style) {
  let props = {};
  if (style.bold)
    props.bold = !0;
  if (style.dim)
    props.dim = !0;
  if (style.italic)
    props.italic = !0;
  if (style.underline !== "none")
    props.underline = !0;
  if (style.strikethrough)
    props.strikethrough = !0;
  if (style.inverse)
    props.inverse = !0;
  let fgColor = colorToString(style.fg);
  if (fgColor)
    props.color = fgColor;
  let bgColor = colorToString(style.bg);
  if (bgColor)
    props.backgroundColor = bgColor;
  return props;
}
function colorToString(color2) {
  switch (color2.type) {
    case "named":
      return NAMED_COLOR_MAP[color2.name];
    case "indexed":
      return `ansi256(${color2.index})`;
    case "rgb":
      return `rgb(${color2.r},${color2.g},${color2.b})`;
    case "default":
      return;
  }
}
function propsEqual(a2, b) {
  return a2.color === b.color && a2.backgroundColor === b.backgroundColor && a2.bold === b.bold && a2.dim === b.dim && a2.italic === b.italic && a2.underline === b.underline && a2.strikethrough === b.strikethrough && a2.inverse === b.inverse && a2.hyperlink === b.hyperlink;
}
function hasAnyProps(props) {
  return props.color !== void 0 || props.backgroundColor !== void 0 || props.dim === !0 || props.bold === !0 || props.italic === !0 || props.underline === !0 || props.strikethrough === !0 || props.inverse === !0 || props.hyperlink !== void 0;
}
function hasAnyTextProps(props) {
  return props.color !== void 0 || props.backgroundColor !== void 0 || props.dim === !0 || props.bold === !0 || props.italic === !0 || props.underline === !0 || props.strikethrough === !0 || props.inverse === !0;
}
function StyledText(t0) {
  let $3 = import_compiler_runtime9.c(14), bold2, children, dim2, rest;
  if ($3[0] !== t0)
    ({
      bold: bold2,
      dim: dim2,
      children,
      ...rest
    } = t0), $3[0] = t0, $3[1] = bold2, $3[2] = children, $3[3] = dim2, $3[4] = rest;
  else
    bold2 = $3[1], children = $3[2], dim2 = $3[3], rest = $3[4];
  if (dim2) {
    let t12;
    if ($3[5] !== children || $3[6] !== rest)
      t12 = /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
        ...rest,
        dim: !0,
        children
      }, void 0, !1, void 0, this), $3[5] = children, $3[6] = rest, $3[7] = t12;
    else
      t12 = $3[7];
    return t12;
  }
  if (bold2) {
    let t12;
    if ($3[8] !== children || $3[9] !== rest)
      t12 = /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
        ...rest,
        bold: !0,
        children
      }, void 0, !1, void 0, this), $3[8] = children, $3[9] = rest, $3[10] = t12;
    else
      t12 = $3[10];
    return t12;
  }
  let t1;
  if ($3[11] !== children || $3[12] !== rest)
    t1 = /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
      ...rest,
      children
    }, void 0, !1, void 0, this), $3[11] = children, $3[12] = rest, $3[13] = t1;
  else
    t1 = $3[13];
  return t1;
}
var import_compiler_runtime9, import_react13, jsx_dev_runtime12, Ansi, NAMED_COLOR_MAP;
var init_Ansi = __esm(() => {
  init_Link();
  init_Text();
  init_termio();
  import_compiler_runtime9 = __toESM(require_react_compiler_runtime_development(), 1), import_react13 = __toESM(require_react_development(), 1), jsx_dev_runtime12 = __toESM(require_react_jsx_dev_runtime_development(), 1), Ansi = import_react13.default.memo(function(t0) {
    let $3 = import_compiler_runtime9.c(12), {
      children,
      dimColor
    } = t0;
    if (typeof children !== "string") {
      let t12;
      if ($3[0] !== children || $3[1] !== dimColor)
        t12 = dimColor ? /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
          dim: !0,
          children: String(children)
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
          children: String(children)
        }, void 0, !1, void 0, this), $3[0] = children, $3[1] = dimColor, $3[2] = t12;
      else
        t12 = $3[2];
      return t12;
    }
    if (children === "")
      return null;
    let t1, t2;
    if ($3[3] !== children || $3[4] !== dimColor) {
      t2 = Symbol.for("react.early_return_sentinel");
      bb0: {
        let spans = parseToSpans(children);
        if (spans.length === 0) {
          t2 = null;
          break bb0;
        }
        if (spans.length === 1 && !hasAnyProps(spans[0].props)) {
          t2 = dimColor ? /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
            dim: !0,
            children: spans[0].text
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
            children: spans[0].text
          }, void 0, !1, void 0, this);
          break bb0;
        }
        let t32;
        if ($3[7] !== dimColor)
          t32 = (span, i4) => {
            let hyperlink = span.props.hyperlink;
            if (dimColor)
              span.props.dim = !0;
            let hasTextProps = hasAnyTextProps(span.props);
            if (hyperlink)
              return hasTextProps ? /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Link, {
                url: hyperlink,
                children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(StyledText, {
                  color: span.props.color,
                  backgroundColor: span.props.backgroundColor,
                  dim: span.props.dim,
                  bold: span.props.bold,
                  italic: span.props.italic,
                  underline: span.props.underline,
                  strikethrough: span.props.strikethrough,
                  inverse: span.props.inverse,
                  children: span.text
                }, void 0, !1, void 0, this)
              }, i4, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Link, {
                url: hyperlink,
                children: span.text
              }, i4, !1, void 0, this);
            return hasTextProps ? /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(StyledText, {
              color: span.props.color,
              backgroundColor: span.props.backgroundColor,
              dim: span.props.dim,
              bold: span.props.bold,
              italic: span.props.italic,
              underline: span.props.underline,
              strikethrough: span.props.strikethrough,
              inverse: span.props.inverse,
              children: span.text
            }, i4, !1, void 0, this) : span.text;
          }, $3[7] = dimColor, $3[8] = t32;
        else
          t32 = $3[8];
        t1 = spans.map(t32);
      }
      $3[3] = children, $3[4] = dimColor, $3[5] = t1, $3[6] = t2;
    } else
      t1 = $3[5], t2 = $3[6];
    if (t2 !== Symbol.for("react.early_return_sentinel"))
      return t2;
    let content = t1, t3;
    if ($3[9] !== content || $3[10] !== dimColor)
      t3 = dimColor ? /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
        dim: !0,
        children: content
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Text, {
        children: content
      }, void 0, !1, void 0, this), $3[9] = content, $3[10] = dimColor, $3[11] = t3;
    else
      t3 = $3[11];
    return t3;
  });
  NAMED_COLOR_MAP = {
    black: "ansi:black",
    red: "ansi:red",
    green: "ansi:green",
    yellow: "ansi:yellow",
    blue: "ansi:blue",
    magenta: "ansi:magenta",
    cyan: "ansi:cyan",
    white: "ansi:white",
    brightBlack: "ansi:blackBright",
    brightRed: "ansi:redBright",
    brightGreen: "ansi:greenBright",
    brightYellow: "ansi:yellowBright",
    brightBlue: "ansi:blueBright",
    brightMagenta: "ansi:magentaBright",
    brightCyan: "ansi:cyanBright",
    brightWhite: "ansi:whiteBright"
  };
});
