// Original: src/utils/plugins/loadPluginOutputStyles.ts
import { basename as basename31 } from "path";
async function loadOutputStylesFromDirectory(outputStylesPath, pluginName, loadedPaths) {
  let styles5 = [];
  return await walkPluginMarkdown(outputStylesPath, async (fullPath) => {
    let style = await loadOutputStyleFromFile(fullPath, pluginName, loadedPaths);
    if (style)
      styles5.push(style);
  }, { logLabel: "output-styles" }), styles5;
}
async function loadOutputStyleFromFile(filePath, pluginName, loadedPaths) {
  let fs17 = getFsImplementation();
  if (isDuplicatePath(fs17, filePath, loadedPaths))
    return null;
  try {
    let content = await fs17.readFile(filePath, { encoding: "utf-8" }), { frontmatter, content: markdownContent } = parseFrontmatter(content, filePath), fileName = basename31(filePath, ".md"), baseStyleName = frontmatter.name || fileName, name3 = `${pluginName}:${baseStyleName}`, description = coerceDescriptionToString(frontmatter.description, name3) ?? extractDescriptionFromMarkdown(markdownContent, `Output style from ${pluginName} plugin`), forceRaw = frontmatter["force-for-plugin"], forceForPlugin = forceRaw === !0 || forceRaw === "true" ? !0 : forceRaw === !1 || forceRaw === "false" ? !1 : void 0;
    return {
      name: name3,
      description,
      prompt: markdownContent.trim(),
      source: "plugin",
      forceForPlugin
    };
  } catch (error44) {
    return logForDebugging(`Failed to load output style from ${filePath}: ${error44}`, {
      level: "error"
    }), null;
  }
}
function clearPluginOutputStyleCache() {
  loadPluginOutputStyles.cache?.clear?.();
}
var loadPluginOutputStyles;
var init_loadPluginOutputStyles = __esm(() => {
  init_memoize();
  init_debug();
  init_frontmatterParser();
  init_fsOperations();
  init_markdownConfigLoader();
  init_pluginLoader();
  init_walkPluginMarkdown();
  loadPluginOutputStyles = memoize_default(async () => {
    let { enabled: enabled2, errors: errors8 } = await loadAllPluginsCacheOnly(), allStyles = [];
    if (errors8.length > 0)
      logForDebugging(`Plugin loading errors: ${errors8.map((e) => getPluginErrorMessage(e)).join(", ")}`);
    for (let plugin of enabled2) {
      let loadedPaths = /* @__PURE__ */ new Set;
      if (plugin.outputStylesPath)
        try {
          let styles5 = await loadOutputStylesFromDirectory(plugin.outputStylesPath, plugin.name, loadedPaths);
          if (allStyles.push(...styles5), styles5.length > 0)
            logForDebugging(`Loaded ${styles5.length} output styles from plugin ${plugin.name} default directory`);
        } catch (error44) {
          logForDebugging(`Failed to load output styles from plugin ${plugin.name} default directory: ${error44}`, { level: "error" });
        }
      if (plugin.outputStylesPaths)
        for (let stylePath of plugin.outputStylesPaths)
          try {
            let stats = await getFsImplementation().stat(stylePath);
            if (stats.isDirectory()) {
              let styles5 = await loadOutputStylesFromDirectory(stylePath, plugin.name, loadedPaths);
              if (allStyles.push(...styles5), styles5.length > 0)
                logForDebugging(`Loaded ${styles5.length} output styles from plugin ${plugin.name} custom path: ${stylePath}`);
            } else if (stats.isFile() && stylePath.endsWith(".md")) {
              let style = await loadOutputStyleFromFile(stylePath, plugin.name, loadedPaths);
              if (style)
                allStyles.push(style), logForDebugging(`Loaded output style from plugin ${plugin.name} custom file: ${stylePath}`);
            }
          } catch (error44) {
            logForDebugging(`Failed to load output styles from plugin ${plugin.name} custom path ${stylePath}: ${error44}`, { level: "error" });
          }
    }
    return logForDebugging(`Total plugin output styles loaded: ${allStyles.length}`), allStyles;
  });
});
