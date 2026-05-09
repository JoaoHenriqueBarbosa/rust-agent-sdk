// function: toIDEDisplayName
function toIDEDisplayName(terminal) {
  if (!terminal)
    return "IDE";
  let config10 = supportedIdeConfigs[terminal];
  if (config10)
    return config10.displayName;
  let editorName = EDITOR_DISPLAY_NAMES[terminal.toLowerCase().trim()];
  if (editorName)
    return editorName;
  let command12 = terminal.split(" ")[0], commandName = command12 ? basename12(command12).toLowerCase() : null;
  if (commandName) {
    let mappedName = EDITOR_DISPLAY_NAMES[commandName];
    if (mappedName)
      return mappedName;
    return capitalize_default(commandName);
  }
  return capitalize_default(terminal);
}
