// Original: src/commands/memory/memory.tsx
var exports_memory = {};
__export(exports_memory, {
  call: () => call20
});
import { mkdir as mkdir27, writeFile as writeFile32 } from "fs/promises";
function MemoryCommand({
  onDone
}) {
  let handleSelectMemoryFile = async (memoryPath) => {
    try {
      if (memoryPath.includes(getClaudeConfigHomeDir()))
        await mkdir27(getClaudeConfigHomeDir(), {
          recursive: !0
        });
      try {
        await writeFile32(memoryPath, "", {
          encoding: "utf8",
          flag: "wx"
        });
      } catch (e) {
        if (getErrnoCode(e) !== "EEXIST")
          throw e;
      }
      await editFileInEditor(memoryPath);
      let editorSource = "default", editorValue = "";
      if (process.env.VISUAL)
        editorSource = "$VISUAL", editorValue = process.env.VISUAL;
      else if (process.env.EDITOR)
        editorSource = "$EDITOR", editorValue = process.env.EDITOR;
      let editorInfo = editorSource !== "default" ? `Using ${editorSource}="${editorValue}".` : "", editorHint = editorInfo ? `> ${editorInfo} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
      onDone(`Opened memory file at ${getRelativeMemoryPath(memoryPath)}

${editorHint}`, {
        display: "system"
      });
    } catch (error44) {
      logError2(error44), onDone(`Error opening memory file: ${error44}`);
    }
  }, handleCancel = () => {
    onDone("Cancelled memory editing", {
      display: "system"
    });
  };
  return /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(Dialog, {
    title: "Memory",
    onCancel: handleCancel,
    color: "remember",
    children: /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(React57.Suspense, {
          fallback: null,
          children: /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(MemoryFileSelector, {
            onSelect: handleSelectMemoryFile,
            onCancel: handleCancel
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Learn more: ",
              /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(Link, {
                url: "https://code.claude.com/docs/en/memory"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var React57, jsx_dev_runtime202, call20 = async (onDone) => {
  return clearMemoryFileCaches(), await getMemoryFiles(), /* @__PURE__ */ jsx_dev_runtime202.jsxDEV(MemoryCommand, {
    onDone
  }, void 0, !1, void 0, this);
};
var init_memory = __esm(() => {
  init_Dialog();
  init_MemoryFileSelector();
  init_MemoryUpdateNotification();
  init_ink2();
  init_claudemd();
  init_envUtils();
  init_errors();
  init_log3();
  init_promptEditor();
  React57 = __toESM(require_react_development(), 1), jsx_dev_runtime202 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
