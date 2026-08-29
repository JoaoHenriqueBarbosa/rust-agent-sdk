// Original: src/tools/ConfigTool/prompt.ts
function generatePrompt() {
  let globalSettings = [], projectSettings = [];
  for (let [key3, config10] of Object.entries(SUPPORTED_SETTINGS)) {
    if (key3 === "model")
      continue;
    let options2 = getOptionsForSetting(key3), line = `- ${key3}`;
    if (options2)
      line += `: ${options2.map((o5) => `"${o5}"`).join(", ")}`;
    else if (config10.type === "boolean")
      line += ": true/false";
    if (line += ` - ${config10.description}`, config10.source === "global")
      globalSettings.push(line);
    else
      projectSettings.push(line);
  }
  let modelSection = generateModelSection();
  return `Get or set Claude Code configuration settings.

  View or change Claude Code settings. Use when the user requests configuration changes, asks about current settings, or when adjusting a setting would benefit them.


## Usage
- **Get current value:** Omit the "value" parameter
- **Set new value:** Include the "value" parameter

## Configurable settings list
The following settings are available for you to change:

### Global Settings (stored in ~/.claude.json)
${globalSettings.join(`
`)}

### Project Settings (stored in settings.json)
${projectSettings.join(`
`)}

${modelSection}
## Examples
- Get theme: { "setting": "theme" }
- Set dark theme: { "setting": "theme", "value": "dark" }
- Enable vim mode: { "setting": "editorMode", "value": "vim" }
- Enable verbose: { "setting": "verbose", "value": true }
- Change model: { "setting": "model", "value": "opus" }
- Change permission mode: { "setting": "permissions.defaultMode", "value": "plan" }
`;
}
function generateModelSection() {
  try {
    return `## Model
- model - Override the default model. Available options:
${getModelOptions().map((o5) => {
      return `  - ${o5.value === null ? 'null/"default"' : `"${o5.value}"`}: ${o5.descriptionForModel ?? o5.description}`;
    }).join(`
`)}`;
  } catch {
    return `## Model
- model - Override the default model (sonnet, opus, haiku, best, or full model ID)`;
  }
}
var DESCRIPTION13 = "Get or set Claude Code configuration settings.";
var init_prompt15 = __esm(() => {
  init_modelOptions();
  init_voiceModeEnabled();
  init_supportedSettings();
});
