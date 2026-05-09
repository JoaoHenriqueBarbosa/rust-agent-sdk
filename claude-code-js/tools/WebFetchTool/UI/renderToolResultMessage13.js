// function: renderToolResultMessage13
function renderToolResultMessage13({
  bytes,
  code,
  codeText,
  result
}, _progressMessagesForMessage, {
  verbose
}) {
  let formattedSize = formatFileSize(bytes);
  if (verbose)
    return /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedText, {
            children: [
              "Received ",
              /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedText, {
                bold: !0,
                children: formattedSize
              }, void 0, !1, void 0, this),
              " (",
              code,
              " ",
              codeText,
              ")"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedText, {
            children: result
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(MessageResponse, {
    height: 1,
    children: /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedText, {
      children: [
        "Received ",
        /* @__PURE__ */ jsx_dev_runtime138.jsxDEV(ThemedText, {
          bold: !0,
          children: formattedSize
        }, void 0, !1, void 0, this),
        " (",
        code,
        " ",
        codeText,
        ")"
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
