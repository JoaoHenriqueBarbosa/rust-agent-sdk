// function: parsePluginSettings
function parsePluginSettings(raw) {
  let result = PluginSettingsSchema().safeParse(raw);
  if (!result.success)
    return;
  let data = result.data;
  if (Object.keys(data).length === 0)
    return;
  return data;
}
