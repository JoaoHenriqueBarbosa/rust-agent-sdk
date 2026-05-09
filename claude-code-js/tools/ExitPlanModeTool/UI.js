// Original: src/tools/ExitPlanModeTool/UI.tsx
function renderToolUseMessage18() {
  return null;
}
function renderToolResultMessage17(output, _progressMessagesForMessage, {
  theme: _theme
}) {
  let {
    plan,
    filePath
  } = output, isEmpty = !plan || plan.trim() === "", displayPath = filePath ? getDisplayPath(filePath) : "", awaitingLeaderApproval = output.awaitingLeaderApproval;
  if (isEmpty)
    return /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
            color: getModeColor("plan"),
            children: BLACK_CIRCLE
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
            children: " Exited plan mode"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  if (awaitingLeaderApproval)
    return /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
              color: getModeColor("plan"),
              children: BLACK_CIRCLE
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
              children: " Plan submitted for team lead approval"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              filePath && /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Plan file: ",
                  displayPath
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Waiting for team lead to review and approve..."
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
            color: getModeColor("plan"),
            children: BLACK_CIRCLE
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
            children: " User approved Claude's plan"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            filePath && /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Plan saved to: ",
                displayPath,
                " \xB7 /plan to edit"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(Markdown, {
              children: plan
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function renderToolUseRejectedMessage6({
  plan
}, {
  theme: _theme
}) {
  let planContent = plan ?? getPlan() ?? "No plan found";
  return /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: /* @__PURE__ */ jsx_dev_runtime143.jsxDEV(RejectedPlanMessage, {
      plan: planContent
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime143;
var init_UI17 = __esm(() => {
  init_Markdown();
  init_MessageResponse();
  init_RejectedPlanMessage();
  init_figures2();
  init_PermissionMode();
  init_ink2();
  init_file();
  init_plans();
  jsx_dev_runtime143 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
