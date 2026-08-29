// function: NotifChannelLabel
function NotifChannelLabel(t0) {
  let $3 = import_compiler_runtime142.c(4), {
    value
  } = t0;
  switch (value) {
    case "auto":
      return "Auto";
    case "iterm2": {
      let t1;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          children: [
            "iTerm2 ",
            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "(OSC 9)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[0] = t1;
      else
        t1 = $3[0];
      return t1;
    }
    case "terminal_bell": {
      let t1;
      if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          children: [
            "Terminal Bell ",
            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "(\\a)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[1] = t1;
      else
        t1 = $3[1];
      return t1;
    }
    case "kitty": {
      let t1;
      if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          children: [
            "Kitty ",
            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "(OSC 99)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[2] = t1;
      else
        t1 = $3[2];
      return t1;
    }
    case "ghostty": {
      let t1;
      if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          children: [
            "Ghostty ",
            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "(OSC 777)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[3] = t1;
      else
        t1 = $3[3];
      return t1;
    }
    case "iterm2_with_bell":
      return "iTerm2 w/ Bell";
    case "notifications_disabled":
      return "Disabled";
    default:
      return value;
  }
}
