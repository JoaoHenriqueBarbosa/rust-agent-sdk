// Original: src/utils/promptEditor.ts
function isGuiEditor(editor) {
  return classifyGuiEditor(editor) !== void 0;
}
function editFileInEditor(filePath) {
  let fs17 = getFsImplementation(), inkInstance = instances_default.get(process.stdout);
  if (!inkInstance)
    throw Error("Ink instance not found - cannot pause rendering");
  let editor = getExternalEditor();
  if (!editor)
    return { content: null };
  try {
    fs17.statSync(filePath);
  } catch {
    return { content: null };
  }
  let useAlternateScreen = !isGuiEditor(editor);
  if (useAlternateScreen)
    inkInstance.enterAlternateScreen();
  else
    inkInstance.pause(), inkInstance.suspendStdin();
  try {
    let editorCommand = EDITOR_OVERRIDES[editor] ?? editor;
    return execSync_DEPRECATED(`${editorCommand} "${filePath}"`, {
      stdio: "inherit"
    }), { content: fs17.readFileSync(filePath, { encoding: "utf-8" }) };
  } catch (err2) {
    if (typeof err2 === "object" && err2 !== null && "status" in err2 && typeof err2.status === "number") {
      let status = err2.status;
      if (status !== 0)
        return {
          content: null,
          error: `${toIDEDisplayName(editor)} exited with code ${status}`
        };
    }
    return { content: null };
  } finally {
    if (useAlternateScreen)
      inkInstance.exitAlternateScreen();
    else
      inkInstance.resumeStdin(), inkInstance.resume();
  }
}
function recollapsePastedContent(editedPrompt, originalPrompt, pastedContents) {
  let collapsed = editedPrompt;
  for (let [id, content] of Object.entries(pastedContents))
    if (content.type === "text") {
      let pasteId = parseInt(id), contentStr = content.content, contentIndex = collapsed.indexOf(contentStr);
      if (contentIndex !== -1) {
        let numLines = getPastedTextRefNumLines(contentStr), ref = formatPastedTextRef(pasteId, numLines);
        collapsed = collapsed.slice(0, contentIndex) + ref + collapsed.slice(contentIndex + contentStr.length);
      }
    }
  return collapsed;
}
function editPromptInEditor(currentPrompt, pastedContents) {
  let fs17 = getFsImplementation(), tempFile = generateTempFilePath();
  try {
    let expandedPrompt = pastedContents ? expandPastedTextRefs(currentPrompt, pastedContents) : currentPrompt;
    writeFileSync_DEPRECATED(tempFile, expandedPrompt, {
      encoding: "utf-8",
      flush: !0
    });
    let result = editFileInEditor(tempFile);
    if (result.content === null)
      return result;
    let finalContent = result.content;
    if (finalContent.endsWith(`
`) && !finalContent.endsWith(`

`))
      finalContent = finalContent.slice(0, -1);
    if (pastedContents)
      finalContent = recollapsePastedContent(finalContent, currentPrompt, pastedContents);
    return { content: finalContent };
  } finally {
    try {
      fs17.unlinkSync(tempFile);
    } catch {}
  }
}
var EDITOR_OVERRIDES;
var init_promptEditor = __esm(() => {
  init_history();
  init_instances();
  init_editor();
  init_execSyncWrapper();
  init_fsOperations();
  init_ide();
  init_slowOperations();
  init_tempfile();
  EDITOR_OVERRIDES = {
    code: "code -w",
    subl: "subl --wait"
  };
});
