// Original: src/skills/bundledSkills.ts
import { constants as fsConstants7 } from "fs";
import { mkdir as mkdir33, open as open13 } from "fs/promises";
import { dirname as dirname56, isAbsolute as isAbsolute25, join as join126, normalize as normalize14, sep as pathSep2 } from "path";
function registerBundledSkill(definition) {
  let { files: files3 } = definition, skillRoot, getPromptForCommand = definition.getPromptForCommand;
  if (files3 && Object.keys(files3).length > 0) {
    skillRoot = getBundledSkillExtractDir(definition.name);
    let extractionPromise, inner = definition.getPromptForCommand;
    getPromptForCommand = async (args, ctx) => {
      extractionPromise ??= extractBundledSkillFiles(definition.name, files3);
      let extractedDir = await extractionPromise, blocks = await inner(args, ctx);
      if (extractedDir === null)
        return blocks;
      return prependBaseDir(blocks, extractedDir);
    };
  }
  let command19 = {
    type: "prompt",
    name: definition.name,
    description: definition.description,
    aliases: definition.aliases,
    hasUserSpecifiedDescription: !0,
    allowedTools: definition.allowedTools ?? [],
    argumentHint: definition.argumentHint,
    whenToUse: definition.whenToUse,
    model: definition.model,
    disableModelInvocation: definition.disableModelInvocation ?? !1,
    userInvocable: definition.userInvocable ?? !0,
    contentLength: 0,
    source: "bundled",
    loadedFrom: "bundled",
    hooks: definition.hooks,
    skillRoot,
    context: definition.context,
    agent: definition.agent,
    isEnabled: definition.isEnabled,
    isHidden: !(definition.userInvocable ?? !0),
    progressMessage: "running",
    getPromptForCommand
  };
  bundledSkills.push(command19);
}
function getBundledSkills() {
  return [...bundledSkills];
}
function getBundledSkillExtractDir(skillName) {
  return join126(getBundledSkillsRoot(), skillName);
}
async function extractBundledSkillFiles(skillName, files3) {
  let dir = getBundledSkillExtractDir(skillName);
  try {
    return await writeSkillFiles(dir, files3), dir;
  } catch (e) {
    return logForDebugging(`Failed to extract bundled skill '${skillName}' to ${dir}: ${e instanceof Error ? e.message : String(e)}`), null;
  }
}
async function writeSkillFiles(dir, files3) {
  let byParent = /* @__PURE__ */ new Map;
  for (let [relPath, content] of Object.entries(files3)) {
    let target = resolveSkillFilePath(dir, relPath), parent2 = dirname56(target), entry = [target, content], group = byParent.get(parent2);
    if (group)
      group.push(entry);
    else
      byParent.set(parent2, [entry]);
  }
  await Promise.all([...byParent].map(async ([parent2, entries2]) => {
    await mkdir33(parent2, { recursive: !0, mode: 448 }), await Promise.all(entries2.map(([p4, c3]) => safeWriteFile(p4, c3)));
  }));
}
async function safeWriteFile(p4, content) {
  let fh = await open13(p4, SAFE_WRITE_FLAGS, 384);
  try {
    await fh.writeFile(content, "utf8");
  } finally {
    await fh.close();
  }
}
function resolveSkillFilePath(baseDir, relPath) {
  let normalized = normalize14(relPath);
  if (isAbsolute25(normalized) || normalized.split(pathSep2).includes("..") || normalized.split("/").includes(".."))
    throw Error(`bundled skill file path escapes skill dir: ${relPath}`);
  return join126(baseDir, normalized);
}
function prependBaseDir(blocks, baseDir) {
  let prefix = `Base directory for this skill: ${baseDir}

`;
  if (blocks.length > 0 && blocks[0].type === "text")
    return [
      { type: "text", text: prefix + blocks[0].text },
      ...blocks.slice(1)
    ];
  return [{ type: "text", text: prefix }, ...blocks];
}
var bundledSkills, O_NOFOLLOW, SAFE_WRITE_FLAGS;
var init_bundledSkills = __esm(() => {
  init_debug();
  init_filesystem();
  bundledSkills = [];
  O_NOFOLLOW = fsConstants7.O_NOFOLLOW ?? 0, SAFE_WRITE_FLAGS = process.platform === "win32" ? "wx" : fsConstants7.O_WRONLY | fsConstants7.O_CREAT | fsConstants7.O_EXCL | O_NOFOLLOW;
});
