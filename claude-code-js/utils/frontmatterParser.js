// Original: src/utils/frontmatterParser.ts
function quoteProblematicValues(frontmatterText) {
  let lines = frontmatterText.split(`
`), result = [];
  for (let line of lines) {
    let match = line.match(/^([a-zA-Z_-]+):\s+(.+)$/);
    if (match) {
      let [, key, value] = match;
      if (!key || !value) {
        result.push(line);
        continue;
      }
      if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
        result.push(line);
        continue;
      }
      if (YAML_SPECIAL_CHARS.test(value)) {
        let escaped = value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
        result.push(`${key}: "${escaped}"`);
        continue;
      }
    }
    result.push(line);
  }
  return result.join(`
`);
}
function parseFrontmatter(markdown, sourcePath) {
  let match = markdown.match(FRONTMATTER_REGEX);
  if (!match)
    return {
      frontmatter: {},
      content: markdown
    };
  let frontmatterText = match[1] || "", content = markdown.slice(match[0].length), frontmatter = {};
  try {
    let parsed = parseYaml(frontmatterText);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      frontmatter = parsed;
  } catch {
    try {
      let quotedText = quoteProblematicValues(frontmatterText), parsed = parseYaml(quotedText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        frontmatter = parsed;
    } catch (retryError) {
      let location = sourcePath ? ` in ${sourcePath}` : "";
      logForDebugging(`Failed to parse YAML frontmatter${location}: ${retryError instanceof Error ? retryError.message : retryError}`, { level: "warn" });
    }
  }
  return {
    frontmatter,
    content
  };
}
function splitPathInFrontmatter(input) {
  if (Array.isArray(input))
    return input.flatMap(splitPathInFrontmatter);
  if (typeof input !== "string")
    return [];
  let parts = [], current = "", braceDepth = 0;
  for (let i4 = 0;i4 < input.length; i4++) {
    let char = input[i4];
    if (char === "{")
      braceDepth++, current += char;
    else if (char === "}")
      braceDepth--, current += char;
    else if (char === "," && braceDepth === 0) {
      let trimmed2 = current.trim();
      if (trimmed2)
        parts.push(trimmed2);
      current = "";
    } else
      current += char;
  }
  let trimmed = current.trim();
  if (trimmed)
    parts.push(trimmed);
  return parts.filter((p4) => p4.length > 0).flatMap((pattern) => expandBraces(pattern));
}
function expandBraces(pattern) {
  let braceMatch = pattern.match(/^([^{]*)\{([^}]+)\}(.*)$/);
  if (!braceMatch)
    return [pattern];
  let prefix = braceMatch[1] || "", alternatives = braceMatch[2] || "", suffix = braceMatch[3] || "", parts = alternatives.split(",").map((alt) => alt.trim()), expanded = [];
  for (let part of parts) {
    let combined = prefix + part + suffix, furtherExpanded = expandBraces(combined);
    expanded.push(...furtherExpanded);
  }
  return expanded;
}
function parsePositiveIntFromFrontmatter(value) {
  if (value === void 0 || value === null)
    return;
  let parsed = typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isInteger(parsed) && parsed > 0)
    return parsed;
  return;
}
function coerceDescriptionToString(value, componentName, pluginName) {
  if (value == null)
    return null;
  if (typeof value === "string")
    return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  let source = pluginName ? `${pluginName}:${componentName}` : componentName ?? "unknown";
  return logForDebugging(`Description invalid for ${source} - omitting`, {
    level: "warn"
  }), null;
}
function parseBooleanFrontmatter(value) {
  return value === !0 || value === "true";
}
function parseShellFrontmatter(value, source) {
  if (value == null)
    return;
  let normalized = String(value).trim().toLowerCase();
  if (normalized === "")
    return;
  if (FRONTMATTER_SHELLS.includes(normalized))
    return normalized;
  logForDebugging(`Frontmatter 'shell: ${value}' in ${source} is not recognized. Valid values: ${FRONTMATTER_SHELLS.join(", ")}. Falling back to bash.`, { level: "warn" });
  return;
}
var YAML_SPECIAL_CHARS, FRONTMATTER_REGEX, FRONTMATTER_SHELLS;
var init_frontmatterParser = __esm(() => {
  init_debug();
  YAML_SPECIAL_CHARS = /[{}[\]*&#!|>%@`]|: /;
  FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)---\s*\n?/;
  FRONTMATTER_SHELLS = ["bash", "powershell"];
});
