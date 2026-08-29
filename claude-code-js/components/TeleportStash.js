// Original: src/components/TeleportStash.tsx
function TeleportStash({
  onStashAndContinue,
  onCancel
}) {
  let [gitFileStatus, setGitFileStatus] = import_react74.useState(null), changedFiles = gitFileStatus !== null ? [...gitFileStatus.tracked, ...gitFileStatus.untracked] : [], [loading, setLoading] = import_react74.useState(!0), [stashing, setStashing] = import_react74.useState(!1), [error44, setError] = import_react74.useState(null);
  import_react74.useEffect(() => {
    (async () => {
      try {
        let fileStatus = await getFileStatus();
        setGitFileStatus(fileStatus);
      } catch (err2) {
        let errorMessage2 = err2 instanceof Error ? err2.message : String(err2);
        logForDebugging(`Error getting changed files: ${errorMessage2}`, {
          level: "error"
        }), setError("Failed to get changed files");
      } finally {
        setLoading(!1);
      }
    })();
  }, []);
  let handleStash = async () => {
    setStashing(!0);
    try {
      if (logForDebugging("Stashing changes before teleport..."), await stashToCleanState("Teleport auto-stash"))
        logForDebugging("Successfully stashed changes"), onStashAndContinue();
      else
        setError("Failed to stash changes");
    } catch (err_0) {
      let errorMessage_0 = err_0 instanceof Error ? err_0.message : String(err_0);
      logForDebugging(`Error stashing changes: ${errorMessage_0}`, {
        level: "error"
      }), setError("Failed to stash changes");
    } finally {
      setStashing(!1);
    }
  }, handleSelectChange = (value) => {
    if (value === "stash")
      handleStash();
    else
      onCancel();
  };
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      padding: 1,
      children: /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
            children: [
              " Checking git status",
              figures_default.ellipsis
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  if (error44)
    return /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: [
            "Error: ",
            error44
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Press "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
              bold: !0,
              children: "Escape"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " to cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let showFileCount = changedFiles.length > 8;
  return /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(Dialog, {
    title: "Working Directory Has Changes",
    onCancel,
    children: [
      /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
        children: "Teleport will switch git branches. The following changes were found:"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingLeft: 2,
        children: changedFiles.length > 0 ? showFileCount ? /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
          children: [
            changedFiles.length,
            " files changed"
          ]
        }, void 0, !0, void 0, this) : changedFiles.map((file2, index) => /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
          children: file2
        }, index, !1, void 0, this)) : /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "No changes detected"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
        children: "Would you like to stash these changes and continue with teleport?"
      }, void 0, !1, void 0, this),
      stashing ? /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(ThemedText, {
            children: " Stashing changes..."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime117.jsxDEV(Select, {
        options: [{
          label: "Stash changes and continue",
          value: "stash"
        }, {
          label: "Exit",
          value: "exit"
        }],
        onChange: handleSelectChange
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react74, jsx_dev_runtime117;
var init_TeleportStash = __esm(() => {
  init_figures();
  init_ink2();
  init_debug();
  init_git();
  init_CustomSelect();
  init_Dialog();
  init_Spinner2();
  import_react74 = __toESM(require_react_development(), 1), jsx_dev_runtime117 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
