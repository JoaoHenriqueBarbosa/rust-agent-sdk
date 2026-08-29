// Original: src/tools/BriefTool/UI.tsx
function renderToolUseMessage16() {
  return "";
}
function renderToolResultMessage15(output, _progressMessages, options2) {
  let hasAttachments = (output.attachments?.length ?? 0) > 0;
  if (!output.message && !hasAttachments)
    return null;
  if (options2?.isTranscriptMode)
    return /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
          minWidth: 2,
          children: /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
            color: "text",
            children: BLACK_CIRCLE
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            output.message ? /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(Markdown, {
              children: output.message
            }, void 0, !1, void 0, this) : null,
            /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(AttachmentList, {
              attachments: output.attachments
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (options2?.isBriefOnly) {
    let ts = output.sentAt ? formatBriefTimestamp(output.sentAt) : "";
    return /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      paddingLeft: 2,
      children: [
        /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
              color: "briefLabelClaude",
              children: "Claude"
            }, void 0, !1, void 0, this),
            ts ? /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                " ",
                ts
              ]
            }, void 0, !0, void 0, this) : null
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            output.message ? /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(Markdown, {
              children: output.message
            }, void 0, !1, void 0, this) : null,
            /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(AttachmentList, {
              attachments: output.attachments
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    marginTop: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
        minWidth: 2
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          output.message ? /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(Markdown, {
            children: output.message
          }, void 0, !1, void 0, this) : null,
          /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(AttachmentList, {
            attachments: output.attachments
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function AttachmentList(t0) {
  let $3 = import_compiler_runtime118.c(4), {
    attachments
  } = t0;
  if (!attachments || attachments.length === 0)
    return null;
  let t1;
  if ($3[0] !== attachments)
    t1 = attachments.map(_temp49), $3[0] = attachments, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: t1
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  return t2;
}
function _temp49(att) {
  return /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    children: [
      /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.pointerSmall,
          " ",
          att.isImage ? "[image]" : "[file]",
          " "
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
        children: getDisplayPath(att.path)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime140.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " (",
          formatFileSize(att.size),
          ")"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, att.path, !0, void 0, this);
}
var import_compiler_runtime118, jsx_dev_runtime140;
var init_UI15 = __esm(() => {
  init_figures();
  init_Markdown();
  init_figures2();
  init_ink2();
  init_file();
  init_format();
  import_compiler_runtime118 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime140 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
