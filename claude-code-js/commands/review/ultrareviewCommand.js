// Original: src/commands/review/ultrareviewCommand.tsx
var exports_ultrareviewCommand = {};
__export(exports_ultrareviewCommand, {
  call: () => call31
});
function contentBlocksToString(blocks) {
  return blocks.map((b) => b.type === "text" ? b.text : "").filter(Boolean).join(`
`);
}
async function launchAndDone(args, context7, onDone, billingNote, signal) {
  let result = await launchRemoteReview(args, context7, billingNote);
  if (signal?.aborted)
    return;
  if (result)
    onDone(contentBlocksToString(result), {
      shouldQuery: !0
    });
  else
    onDone("Ultrareview failed to launch the remote session. Check that this is a GitHub repo and try again.", {
      display: "system"
    });
}
var jsx_dev_runtime275, call31 = async (onDone, context7, args) => {
  let gate = await checkOverageGate();
  if (gate.kind === "not-enabled")
    return onDone("Free ultrareviews used. Enable Extra Usage at https://claude.ai/settings/billing to continue.", {
      display: "system"
    }), null;
  if (gate.kind === "low-balance")
    return onDone(`Balance too low to launch ultrareview ($${gate.available.toFixed(2)} available, $10 minimum). Top up at https://claude.ai/settings/billing`, {
      display: "system"
    }), null;
  if (gate.kind === "needs-confirm")
    return /* @__PURE__ */ jsx_dev_runtime275.jsxDEV(UltrareviewOverageDialog, {
      onProceed: async (signal) => {
        if (await launchAndDone(args, context7, onDone, " This review bills as Extra Usage.", signal), !signal.aborted)
          confirmOverage();
      },
      onCancel: () => onDone("Ultrareview cancelled.", {
        display: "system"
      })
    }, void 0, !1, void 0, this);
  return await launchAndDone(args, context7, onDone, gate.billingNote), null;
};
var init_ultrareviewCommand = __esm(() => {
  init_reviewRemote();
  init_UltrareviewOverageDialog();
  jsx_dev_runtime275 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
