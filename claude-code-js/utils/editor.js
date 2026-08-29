// Original: src/utils/editor.ts
import {
  spawn as spawn9,
  spawnSync as spawnSync4
} from "child_process";
import { basename as basename35 } from "path";
function isCommandAvailable3(command14) {
  return !!whichSync(command14);
}
function classifyGuiEditor(editor) {
  let base2 = basename35(editor.split(" ")[0] ?? "");
  return GUI_EDITORS.find((g) => base2.includes(g));
}
function guiGotoArgv(guiFamily, filePath, line) {
  if (!line)
    return [filePath];
  if (VSCODE_FAMILY.has(guiFamily))
    return ["-g", `${filePath}:${line}`];
  if (guiFamily === "subl")
    return [`${filePath}:${line}`];
  return [filePath];
}
function openFileInExternalEditor(filePath, line) {
  let editor = getExternalEditor();
  if (!editor)
    return !1;
  let parts = editor.split(" "), base2 = parts[0] ?? editor, editorArgs = parts.slice(1), guiFamily = classifyGuiEditor(editor);
  if (guiFamily) {
    let gotoArgv = guiGotoArgv(guiFamily, filePath, line), detachedOpts = { detached: !0, stdio: "ignore" }, child;
    if (process.platform === "win32") {
      let gotoStr = gotoArgv.map((a2) => `"${a2}"`).join(" ");
      child = spawn9(`${editor} ${gotoStr}`, { ...detachedOpts, shell: !0 });
    } else
      child = spawn9(base2, [...editorArgs, ...gotoArgv], detachedOpts);
    return child.on("error", (e) => logForDebugging(`editor spawn failed: ${e}`, { level: "error" })), child.unref(), !0;
  }
  let inkInstance = instances_default.get(process.stdout);
  if (!inkInstance)
    return !1;
  let useGotoLine = line && PLUS_N_EDITORS.test(basename35(base2));
  inkInstance.enterAlternateScreen();
  try {
    let syncOpts = { stdio: "inherit" }, result;
    if (process.platform === "win32") {
      let lineArg = useGotoLine ? `+${line} ` : "";
      result = spawnSync4(`${editor} ${lineArg}"${filePath}"`, {
        ...syncOpts,
        shell: !0
      });
    } else {
      let args = [
        ...editorArgs,
        ...useGotoLine ? [`+${line}`, filePath] : [filePath]
      ];
      result = spawnSync4(base2, args, syncOpts);
    }
    if (result.error)
      return logForDebugging(`editor spawn failed: ${result.error}`, {
        level: "error"
      }), !1;
    return !0;
  } finally {
    inkInstance.exitAlternateScreen();
  }
}
var GUI_EDITORS, PLUS_N_EDITORS, VSCODE_FAMILY, getExternalEditor;
var init_editor = __esm(() => {
  init_memoize();
  init_instances();
  init_debug();
  init_which();
  GUI_EDITORS = [
    "code",
    "cursor",
    "windsurf",
    "codium",
    "subl",
    "atom",
    "gedit",
    "notepad++",
    "notepad"
  ], PLUS_N_EDITORS = /\b(vi|vim|nvim|nano|emacs|pico|micro|helix|hx)\b/, VSCODE_FAMILY = /* @__PURE__ */ new Set(["code", "cursor", "windsurf", "codium"]);
  getExternalEditor = memoize_default(() => {
    if (process.env.VISUAL?.trim())
      return process.env.VISUAL.trim();
    if (process.env.EDITOR?.trim())
      return process.env.EDITOR.trim();
    if (process.platform === "win32")
      return "start /wait notepad";
    return ["code", "vi", "nano"].find((command14) => isCommandAvailable3(command14));
  });
});
