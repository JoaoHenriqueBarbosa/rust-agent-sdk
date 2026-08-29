// function: handleTeleportPrerequisites
async function handleTeleportPrerequisites(root2, errorsToIgnore) {
  let errors8 = await getTeleportErrors();
  if (errors8.size > 0)
    logEvent("tengu_teleport_errors_detected", {
      error_types: Array.from(errors8).join(","),
      errors_ignored: Array.from(errorsToIgnore || []).join(",")
    }), await new Promise((resolve27) => {
      root2.render(/* @__PURE__ */ jsx_dev_runtime119.jsxDEV(AppStateProvider, {
        children: /* @__PURE__ */ jsx_dev_runtime119.jsxDEV(KeybindingSetup, {
          children: /* @__PURE__ */ jsx_dev_runtime119.jsxDEV(TeleportError, {
            errorsToIgnore,
            onComplete: () => {
              logEvent("tengu_teleport_errors_resolved", {
                error_types: Array.from(errors8).join(",")
              }), resolve27();
            }
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this));
    });
}
