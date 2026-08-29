// function: EmptyStateMessage
function EmptyStateMessage(t0) {
  let $3 = import_compiler_runtime189.c(6), {
    reason
  } = t0;
  switch (reason) {
    case "git-not-installed": {
      let t1;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Git is required to install marketplaces."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Please install git and restart Claude Code."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[0] = t1;
      else
        t1 = $3[0];
      return t1;
    }
    case "all-blocked-by-policy": {
      let t1;
      if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Your organization policy does not allow any external marketplaces."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Contact your administrator."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[1] = t1;
      else
        t1 = $3[1];
      return t1;
    }
    case "policy-restricts-sources": {
      let t1;
      if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Your organization restricts which marketplaces can be added."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Switch to the Marketplaces tab to view allowed sources."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[2] = t1;
      else
        t1 = $3[2];
      return t1;
    }
    case "all-marketplaces-failed": {
      let t1;
      if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Failed to load marketplace data."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Check your network connection."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[3] = t1;
      else
        t1 = $3[3];
      return t1;
    }
    case "all-plugins-installed": {
      let t1;
      if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "All available plugins are already installed."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Check for new plugins later or add more marketplaces."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[4] = t1;
      else
        t1 = $3[4];
      return t1;
    }
    case "no-marketplaces-configured":
    default: {
      let t1;
      if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(jsx_dev_runtime239.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "No plugins available."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Add a marketplace first using the Marketplaces tab."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[5] = t1;
      else
        t1 = $3[5];
      return t1;
    }
  }
}
