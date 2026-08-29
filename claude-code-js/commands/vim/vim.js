// Original: src/commands/vim/vim.ts
var exports_vim = {};
__export(exports_vim, {
  call: () => call39
});
var call39 = async () => {
  let currentMode = getGlobalConfig().editorMode || "normal";
  if (currentMode === "emacs")
    currentMode = "normal";
  let newMode = currentMode === "normal" ? "vim" : "normal";
  return saveGlobalConfig((current) => ({
    ...current,
    editorMode: newMode
  })), logEvent("tengu_editor_mode_changed", {
    mode: newMode,
    source: "command"
  }), {
    type: "text",
    value: `Editor mode set to ${newMode}. ${newMode === "vim" ? "Use Escape key to toggle between INSERT and NORMAL modes." : "Using standard (readline) keyboard bindings."}`
  };
};
var init_vim = __esm(() => {
  init_config4();
});
