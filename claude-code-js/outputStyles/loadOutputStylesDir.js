// Original: src/outputStyles/loadOutputStylesDir.ts
import { basename as basename32 } from "path";
var getOutputStyleDirStyles;
var init_loadOutputStylesDir = __esm(() => {
  init_memoize();
  init_debug();
  init_frontmatterParser();
  init_log3();
  init_markdownConfigLoader();
  init_loadPluginOutputStyles();
  getOutputStyleDirStyles = memoize_default(async (cwd2) => {
    try {
      return (await loadMarkdownFilesForSubdir("output-styles", cwd2)).map(({ filePath, frontmatter, content, source }) => {
        try {
          let styleName = basename32(filePath).replace(/\.md$/, ""), name3 = frontmatter.name || styleName, description = coerceDescriptionToString(frontmatter.description, styleName) ?? extractDescriptionFromMarkdown(content, `Custom ${styleName} output style`), keepCodingInstructionsRaw = frontmatter["keep-coding-instructions"], keepCodingInstructions = keepCodingInstructionsRaw === !0 || keepCodingInstructionsRaw === "true" ? !0 : keepCodingInstructionsRaw === !1 || keepCodingInstructionsRaw === "false" ? !1 : void 0;
          if (frontmatter["force-for-plugin"] !== void 0)
            logForDebugging(`Output style "${name3}" has force-for-plugin set, but this option only applies to plugin output styles. Ignoring.`, { level: "warn" });
          return {
            name: name3,
            description,
            prompt: content.trim(),
            source,
            keepCodingInstructions
          };
        } catch (error44) {
          return logError2(error44), null;
        }
      }).filter((style) => style !== null);
    } catch (error44) {
      return logError2(error44), [];
    }
  });
});
