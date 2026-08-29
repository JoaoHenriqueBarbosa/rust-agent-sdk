// Original: src/commands/keybindings/keybindings.ts
var exports_keybindings = {};
__export(exports_keybindings, {
  call: () => call23
});
import { mkdir as mkdir28, writeFile as writeFile33 } from "fs/promises";
import { dirname as dirname52 } from "path";
async function call23() {
  if (!isKeybindingCustomizationEnabled())
    return {
      type: "text",
      value: "Keybinding customization is not enabled. This feature is currently in preview."
    };
  let keybindingsPath = getKeybindingsPath(), fileExists = !1;
  await mkdir28(dirname52(keybindingsPath), { recursive: !0 });
  try {
    await writeFile33(keybindingsPath, generateKeybindingsTemplate(), {
      encoding: "utf-8",
      flag: "wx"
    });
  } catch (e) {
    if (getErrnoCode(e) === "EEXIST")
      fileExists = !0;
    else
      throw e;
  }
  let result = await editFileInEditor(keybindingsPath);
  if (result.error)
    return {
      type: "text",
      value: `${fileExists ? "Opened" : "Created"} ${keybindingsPath}. Could not open in editor: ${result.error}`
    };
  return {
    type: "text",
    value: fileExists ? `Opened ${keybindingsPath} in your editor.` : `Created ${keybindingsPath} with template. Opened in your editor.`
  };
}
var init_keybindings = __esm(() => {
  init_loadUserBindings();
  init_template2();
  init_errors();
  init_promptEditor();
});
