// Original: src/utils/plugins/validatePlugin.ts
import { readdir as readdir22, readFile as readFile43, stat as stat37 } from "fs/promises";
import * as path24 from "path";
function detectManifestType(filePath) {
  let fileName = path24.basename(filePath), dirName = path24.basename(path24.dirname(filePath));
  if (fileName === "plugin.json")
    return "plugin";
  if (fileName === "marketplace.json")
    return "marketplace";
  if (dirName === ".claude-plugin")
    return "plugin";
  return "unknown";
}
function formatZodErrors(zodError) {
  return zodError.issues.map((error44) => ({
    path: error44.path.join(".") || "root",
    message: error44.message,
    code: error44.code
  }));
}
function checkPathTraversal(p4, field, errors8, hint) {
  if (p4.includes(".."))
    errors8.push({
      path: field,
      message: hint ? `Path contains "..": ${p4}. ${hint}` : `Path contains ".." which could be a path traversal attempt: ${p4}`
    });
}
function marketplaceSourceHint(p4) {
  let stripped = p4.replace(/^(\.\.\/)+/, "");
  return `Plugin source paths are resolved relative to the marketplace root (the directory containing .claude-plugin/), not relative to marketplace.json. Use "${stripped !== p4 ? `./${stripped}` : "./plugins/my-plugin"}" instead of "${p4}".`;
}
async function validatePluginManifest(filePath) {
  let errors8 = [], warnings = [], absolutePath = path24.resolve(filePath), content;
  try {
    content = await readFile43(absolutePath, { encoding: "utf-8" });
  } catch (error44) {
    let code = getErrnoCode(error44), message;
    if (code === "ENOENT")
      message = `File not found: ${absolutePath}`;
    else if (code === "EISDIR")
      message = `Path is not a file: ${absolutePath}`;
    else
      message = `Failed to read file: ${errorMessage(error44)}`;
    return {
      success: !1,
      errors: [{ path: "file", message, code }],
      warnings: [],
      filePath: absolutePath,
      fileType: "plugin"
    };
  }
  let parsed;
  try {
    parsed = jsonParse(content);
  } catch (error44) {
    return {
      success: !1,
      errors: [
        {
          path: "json",
          message: `Invalid JSON syntax: ${errorMessage(error44)}`
        }
      ],
      warnings: [],
      filePath: absolutePath,
      fileType: "plugin"
    };
  }
  if (parsed && typeof parsed === "object") {
    let obj = parsed;
    if (obj.commands)
      (Array.isArray(obj.commands) ? obj.commands : [obj.commands]).forEach((cmd, i5) => {
        if (typeof cmd === "string")
          checkPathTraversal(cmd, `commands[${i5}]`, errors8);
      });
    if (obj.agents)
      (Array.isArray(obj.agents) ? obj.agents : [obj.agents]).forEach((agent, i5) => {
        if (typeof agent === "string")
          checkPathTraversal(agent, `agents[${i5}]`, errors8);
      });
    if (obj.skills)
      (Array.isArray(obj.skills) ? obj.skills : [obj.skills]).forEach((skill, i5) => {
        if (typeof skill === "string")
          checkPathTraversal(skill, `skills[${i5}]`, errors8);
      });
  }
  let toValidate = parsed;
  if (typeof parsed === "object" && parsed !== null) {
    let obj = parsed, strayKeys = Object.keys(obj).filter((k3) => MARKETPLACE_ONLY_MANIFEST_FIELDS.has(k3));
    if (strayKeys.length > 0) {
      let stripped = { ...obj };
      for (let key3 of strayKeys)
        delete stripped[key3], warnings.push({
          path: key3,
          message: `Field '${key3}' belongs in the marketplace entry (marketplace.json), ` + "not plugin.json. It's harmless here but unused \u2014 Claude Code " + "ignores it at load time."
        });
      toValidate = stripped;
    }
  }
  let result = PluginManifestSchema().strict().safeParse(toValidate);
  if (!result.success)
    errors8.push(...formatZodErrors(result.error));
  if (result.success) {
    let manifest = result.data;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.name))
      warnings.push({
        path: "name",
        message: `Plugin name "${manifest.name}" is not kebab-case. Claude Code accepts it, but the Claude.ai marketplace sync requires kebab-case (lowercase letters, digits, and hyphens only, e.g., "my-plugin").`
      });
    if (!manifest.version)
      warnings.push({
        path: "version",
        message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
      });
    if (!manifest.description)
      warnings.push({
        path: "description",
        message: "No description provided. Adding a description helps users understand what your plugin does"
      });
    if (!manifest.author)
      warnings.push({
        path: "author",
        message: "No author information provided. Consider adding author details for plugin attribution"
      });
  }
  return {
    success: errors8.length === 0,
    errors: errors8,
    warnings,
    filePath: absolutePath,
    fileType: "plugin"
  };
}
async function validateMarketplaceManifest(filePath) {
  let errors8 = [], warnings = [], absolutePath = path24.resolve(filePath), content;
  try {
    content = await readFile43(absolutePath, { encoding: "utf-8" });
  } catch (error44) {
    let code = getErrnoCode(error44), message;
    if (code === "ENOENT")
      message = `File not found: ${absolutePath}`;
    else if (code === "EISDIR")
      message = `Path is not a file: ${absolutePath}`;
    else
      message = `Failed to read file: ${errorMessage(error44)}`;
    return {
      success: !1,
      errors: [{ path: "file", message, code }],
      warnings: [],
      filePath: absolutePath,
      fileType: "marketplace"
    };
  }
  let parsed;
  try {
    parsed = jsonParse(content);
  } catch (error44) {
    return {
      success: !1,
      errors: [
        {
          path: "json",
          message: `Invalid JSON syntax: ${errorMessage(error44)}`
        }
      ],
      warnings: [],
      filePath: absolutePath,
      fileType: "marketplace"
    };
  }
  if (parsed && typeof parsed === "object") {
    let obj = parsed;
    if (Array.isArray(obj.plugins))
      obj.plugins.forEach((plugin, i5) => {
        if (plugin && typeof plugin === "object" && "source" in plugin) {
          let source = plugin.source;
          if (typeof source === "string")
            checkPathTraversal(source, `plugins[${i5}].source`, errors8, marketplaceSourceHint(source));
          if (source && typeof source === "object" && "path" in source && typeof source.path === "string")
            checkPathTraversal(source.path, `plugins[${i5}].source.path`, errors8);
        }
      });
  }
  let result = PluginMarketplaceSchema().extend({
    plugins: exports_external.array(PluginMarketplaceEntrySchema().strict())
  }).strict().safeParse(parsed);
  if (!result.success)
    errors8.push(...formatZodErrors(result.error));
  if (result.success) {
    let marketplace = result.data;
    if (!marketplace.plugins || marketplace.plugins.length === 0)
      warnings.push({
        path: "plugins",
        message: "Marketplace has no plugins defined"
      });
    if (marketplace.plugins) {
      marketplace.plugins.forEach((plugin, i5) => {
        if (marketplace.plugins.filter((p4) => p4.name === plugin.name).length > 1)
          errors8.push({
            path: `plugins[${i5}].name`,
            message: `Duplicate plugin name "${plugin.name}" found in marketplace`
          });
      });
      let manifestDir = path24.dirname(absolutePath), marketplaceRoot = path24.basename(manifestDir) === ".claude-plugin" ? path24.dirname(manifestDir) : manifestDir;
      for (let [i5, entry] of marketplace.plugins.entries()) {
        if (!entry.version || typeof entry.source !== "string" || !entry.source.startsWith("./"))
          continue;
        let pluginJsonPath = path24.join(marketplaceRoot, entry.source, ".claude-plugin", "plugin.json"), manifestVersion;
        try {
          let raw = await readFile43(pluginJsonPath, { encoding: "utf-8" }), parsed2 = jsonParse(raw);
          if (typeof parsed2.version === "string")
            manifestVersion = parsed2.version;
        } catch {
          continue;
        }
        if (manifestVersion && manifestVersion !== entry.version)
          warnings.push({
            path: `plugins[${i5}].version`,
            message: `Entry declares version "${entry.version}" but ${entry.source}/.claude-plugin/plugin.json says "${manifestVersion}". ` + "At install time, plugin.json wins (calculatePluginVersion precedence) \u2014 the entry version is silently ignored. " + `Update this entry to "${manifestVersion}" to match.`
          });
      }
    }
    if (!marketplace.metadata?.description)
      warnings.push({
        path: "metadata.description",
        message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
      });
  }
  return {
    success: errors8.length === 0,
    errors: errors8,
    warnings,
    filePath: absolutePath,
    fileType: "marketplace"
  };
}
function validateComponentFile(filePath, content, fileType) {
  let errors8 = [], warnings = [], match = content.match(FRONTMATTER_REGEX);
  if (!match)
    return warnings.push({
      path: "frontmatter",
      message: "No frontmatter block found. Add YAML frontmatter between --- delimiters at the top of the file to set description and other metadata."
    }), { success: !0, errors: errors8, warnings, filePath, fileType };
  let frontmatterText = match[1] || "", parsed;
  try {
    parsed = parseYaml(frontmatterText);
  } catch (e) {
    return errors8.push({
      path: "frontmatter",
      message: `YAML frontmatter failed to parse: ${errorMessage(e)}. At runtime this ${fileType} loads with empty metadata (all frontmatter fields silently dropped).`
    }), { success: !1, errors: errors8, warnings, filePath, fileType };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
    return errors8.push({
      path: "frontmatter",
      message: `Frontmatter must be a YAML mapping (key: value pairs), got ${Array.isArray(parsed) ? "an array" : parsed === null ? "null" : typeof parsed}.`
    }), { success: !1, errors: errors8, warnings, filePath, fileType };
  let fm = parsed;
  if (fm.description !== void 0) {
    let d = fm.description;
    if (typeof d !== "string" && typeof d !== "number" && typeof d !== "boolean" && d !== null)
      errors8.push({
        path: "description",
        message: `description must be a string, got ${Array.isArray(d) ? "array" : typeof d}. At runtime this value is dropped.`
      });
  } else
    warnings.push({
      path: "description",
      message: `No description in frontmatter. A description helps users and Claude understand when to use this ${fileType}.`
    });
  if (fm.name !== void 0 && fm.name !== null && typeof fm.name !== "string")
    errors8.push({
      path: "name",
      message: `name must be a string, got ${typeof fm.name}.`
    });
  let at = fm["allowed-tools"];
  if (at !== void 0 && at !== null) {
    if (typeof at !== "string" && !Array.isArray(at))
      errors8.push({
        path: "allowed-tools",
        message: `allowed-tools must be a string or array of strings, got ${typeof at}.`
      });
    else if (Array.isArray(at) && at.some((t2) => typeof t2 !== "string"))
      errors8.push({
        path: "allowed-tools",
        message: "allowed-tools array must contain only strings."
      });
  }
  let sh = fm.shell;
  if (sh !== void 0 && sh !== null)
    if (typeof sh !== "string")
      errors8.push({
        path: "shell",
        message: `shell must be a string, got ${typeof sh}.`
      });
    else {
      let normalized = sh.trim().toLowerCase();
      if (normalized !== "bash" && normalized !== "powershell")
        errors8.push({
          path: "shell",
          message: `shell must be 'bash' or 'powershell', got '${sh}'.`
        });
    }
  return { success: errors8.length === 0, errors: errors8, warnings, filePath, fileType };
}
async function validateHooksJson(filePath) {
  let content;
  try {
    content = await readFile43(filePath, { encoding: "utf-8" });
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return {
        success: !0,
        errors: [],
        warnings: [],
        filePath,
        fileType: "hooks"
      };
    return {
      success: !1,
      errors: [
        { path: "file", message: `Failed to read file: ${errorMessage(e)}` }
      ],
      warnings: [],
      filePath,
      fileType: "hooks"
    };
  }
  let parsed;
  try {
    parsed = jsonParse(content);
  } catch (e) {
    return {
      success: !1,
      errors: [
        {
          path: "json",
          message: `Invalid JSON syntax: ${errorMessage(e)}. At runtime this breaks the entire plugin load.`
        }
      ],
      warnings: [],
      filePath,
      fileType: "hooks"
    };
  }
  let result = PluginHooksSchema().safeParse(parsed);
  if (!result.success)
    return {
      success: !1,
      errors: formatZodErrors(result.error),
      warnings: [],
      filePath,
      fileType: "hooks"
    };
  return {
    success: !0,
    errors: [],
    warnings: [],
    filePath,
    fileType: "hooks"
  };
}
async function collectMarkdown(dir, isSkillsDir) {
  let entries2;
  try {
    entries2 = await readdir22(dir, { withFileTypes: !0 });
  } catch (e) {
    let code = getErrnoCode(e);
    if (code === "ENOENT" || code === "ENOTDIR")
      return [];
    throw e;
  }
  if (isSkillsDir)
    return entries2.filter((e) => e.isDirectory()).map((e) => path24.join(dir, e.name, "SKILL.md"));
  let out = [];
  for (let entry of entries2) {
    let full = path24.join(dir, entry.name);
    if (entry.isDirectory())
      out.push(...await collectMarkdown(full, !1));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      out.push(full);
  }
  return out;
}
async function validatePluginContents(pluginDir) {
  let results = [], dirs = [
    ["skill", path24.join(pluginDir, "skills")],
    ["agent", path24.join(pluginDir, "agents")],
    ["command", path24.join(pluginDir, "commands")]
  ];
  for (let [fileType, dir] of dirs) {
    let files2 = await collectMarkdown(dir, fileType === "skill");
    for (let filePath of files2) {
      let content;
      try {
        content = await readFile43(filePath, { encoding: "utf-8" });
      } catch (e) {
        if (isENOENT(e))
          continue;
        results.push({
          success: !1,
          errors: [
            { path: "file", message: `Failed to read: ${errorMessage(e)}` }
          ],
          warnings: [],
          filePath,
          fileType
        });
        continue;
      }
      let r4 = validateComponentFile(filePath, content, fileType);
      if (r4.errors.length > 0 || r4.warnings.length > 0)
        results.push(r4);
    }
  }
  let hooksResult = await validateHooksJson(path24.join(pluginDir, "hooks", "hooks.json"));
  if (hooksResult.errors.length > 0 || hooksResult.warnings.length > 0)
    results.push(hooksResult);
  return results;
}
async function validateManifest3(filePath) {
  let absolutePath = path24.resolve(filePath), stats = null;
  try {
    stats = await stat37(absolutePath);
  } catch (e) {
    if (!isENOENT(e))
      throw e;
  }
  if (stats?.isDirectory()) {
    let marketplacePath = path24.join(absolutePath, ".claude-plugin", "marketplace.json"), marketplaceResult = await validateMarketplaceManifest(marketplacePath);
    if (marketplaceResult.errors[0]?.code !== "ENOENT")
      return marketplaceResult;
    let pluginPath = path24.join(absolutePath, ".claude-plugin", "plugin.json"), pluginResult = await validatePluginManifest(pluginPath);
    if (pluginResult.errors[0]?.code !== "ENOENT")
      return pluginResult;
    return {
      success: !1,
      errors: [
        {
          path: "directory",
          message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
        }
      ],
      warnings: [],
      filePath: absolutePath,
      fileType: "plugin"
    };
  }
  switch (detectManifestType(filePath)) {
    case "plugin":
      return validatePluginManifest(filePath);
    case "marketplace":
      return validateMarketplaceManifest(filePath);
    case "unknown": {
      try {
        let content = await readFile43(absolutePath, { encoding: "utf-8" }), parsed = jsonParse(content);
        if (Array.isArray(parsed.plugins))
          return validateMarketplaceManifest(filePath);
      } catch (e) {
        if (getErrnoCode(e) === "ENOENT")
          return {
            success: !1,
            errors: [
              {
                path: "file",
                message: `File not found: ${absolutePath}`
              }
            ],
            warnings: [],
            filePath: absolutePath,
            fileType: "plugin"
          };
      }
      return validatePluginManifest(filePath);
    }
  }
}
var MARKETPLACE_ONLY_MANIFEST_FIELDS;
var init_validatePlugin = __esm(() => {
  init_v4();
  init_errors();
  init_frontmatterParser();
  init_slowOperations();
  init_schemas3();
  MARKETPLACE_ONLY_MANIFEST_FIELDS = /* @__PURE__ */ new Set([
    "category",
    "source",
    "tags",
    "strict",
    "id"
  ]);
});
