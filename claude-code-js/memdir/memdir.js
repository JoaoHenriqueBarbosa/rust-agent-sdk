// Original: src/memdir/memdir.ts
function truncateEntrypointContent(raw) {
  let trimmed = raw.trim(), contentLines = trimmed.split(`
`), lineCount = contentLines.length, byteCount = trimmed.length, wasLineTruncated = lineCount > MAX_ENTRYPOINT_LINES, wasByteTruncated = byteCount > MAX_ENTRYPOINT_BYTES;
  if (!wasLineTruncated && !wasByteTruncated)
    return {
      content: trimmed,
      lineCount,
      byteCount,
      wasLineTruncated,
      wasByteTruncated
    };
  let truncated = wasLineTruncated ? contentLines.slice(0, MAX_ENTRYPOINT_LINES).join(`
`) : trimmed;
  if (truncated.length > MAX_ENTRYPOINT_BYTES) {
    let cutAt = truncated.lastIndexOf(`
`, MAX_ENTRYPOINT_BYTES);
    truncated = truncated.slice(0, cutAt > 0 ? cutAt : MAX_ENTRYPOINT_BYTES);
  }
  let reason = wasByteTruncated && !wasLineTruncated ? `${formatFileSize(byteCount)} (limit: ${formatFileSize(MAX_ENTRYPOINT_BYTES)}) \u2014 index entries are too long` : wasLineTruncated && !wasByteTruncated ? `${lineCount} lines (limit: ${MAX_ENTRYPOINT_LINES})` : `${lineCount} lines and ${formatFileSize(byteCount)}`;
  return {
    content: truncated + `

> WARNING: ${ENTRYPOINT_NAME} is ${reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
    lineCount,
    byteCount,
    wasLineTruncated,
    wasByteTruncated
  };
}
async function ensureMemoryDirExists(memoryDir) {
  let fs9 = getFsImplementation();
  try {
    await fs9.mkdir(memoryDir);
  } catch (e) {
    let code = e instanceof Error && "code" in e && typeof e.code === "string" ? e.code : void 0;
    logForDebugging(`ensureMemoryDirExists failed for ${memoryDir}: ${code ?? String(e)}`, { level: "debug" });
  }
}
function logMemoryDirCounts(memoryDir, baseMetadata) {
  getFsImplementation().readdir(memoryDir).then((dirents) => {
    let fileCount = 0, subdirCount = 0;
    for (let d of dirents)
      if (d.isFile())
        fileCount++;
      else if (d.isDirectory())
        subdirCount++;
    logEvent("tengu_memdir_loaded", {
      ...baseMetadata,
      total_file_count: fileCount,
      total_subdir_count: subdirCount
    });
  }, () => {
    logEvent("tengu_memdir_loaded", baseMetadata);
  });
}
function buildMemoryLines(displayName, memoryDir, extraGuidelines, skipIndex = !1) {
  let howToSave = skipIndex ? [
    "## How to save memories",
    "",
    "Write each memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:",
    "",
    ...MEMORY_FRONTMATTER_EXAMPLE,
    "",
    "- Keep the name, description, and type fields in memory files up-to-date with the content",
    "- Organize memory semantically by topic, not chronologically",
    "- Update or remove memories that turn out to be wrong or outdated",
    "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
  ] : [
    "## How to save memories",
    "",
    "Saving a memory is a two-step process:",
    "",
    "**Step 1** \u2014 write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:",
    "",
    ...MEMORY_FRONTMATTER_EXAMPLE,
    "",
    `**Step 2** \u2014 add a pointer to that file in \`${ENTRYPOINT_NAME}\`. \`${ENTRYPOINT_NAME}\` is an index, not a memory \u2014 each entry should be one line, under ~150 characters: \`- [Title](file.md) \u2014 one-line hook\`. It has no frontmatter. Never write memory content directly into \`${ENTRYPOINT_NAME}\`.`,
    "",
    `- \`${ENTRYPOINT_NAME}\` is always loaded into your conversation context \u2014 lines after ${MAX_ENTRYPOINT_LINES} will be truncated, so keep the index concise`,
    "- Keep the name, description, and type fields in memory files up-to-date with the content",
    "- Organize memory semantically by topic, not chronologically",
    "- Update or remove memories that turn out to be wrong or outdated",
    "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one."
  ], lines = [
    `# ${displayName}`,
    "",
    `You have a persistent, file-based memory system at \`${memoryDir}\`. ${DIR_EXISTS_GUIDANCE}`,
    "",
    "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.",
    "",
    "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
    "",
    ...TYPES_SECTION_INDIVIDUAL,
    ...WHAT_NOT_TO_SAVE_SECTION,
    "",
    ...howToSave,
    "",
    ...WHEN_TO_ACCESS_SECTION,
    "",
    ...TRUSTING_RECALL_SECTION,
    "",
    "## Memory and other forms of persistence",
    "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.",
    "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.",
    "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.",
    "",
    ...extraGuidelines ?? [],
    ""
  ];
  return lines.push(...buildSearchingPastContextSection(memoryDir)), lines;
}
function buildMemoryPrompt(params) {
  let { displayName, memoryDir, extraGuidelines } = params, fs9 = getFsImplementation(), entrypoint = memoryDir + ENTRYPOINT_NAME, entrypointContent = "";
  try {
    entrypointContent = fs9.readFileSync(entrypoint, { encoding: "utf-8" });
  } catch {}
  let lines = buildMemoryLines(displayName, memoryDir, extraGuidelines);
  if (entrypointContent.trim()) {
    let t2 = truncateEntrypointContent(entrypointContent), memoryType = displayName === AUTO_MEM_DISPLAY_NAME ? "auto" : "agent";
    logMemoryDirCounts(memoryDir, {
      content_length: t2.byteCount,
      line_count: t2.lineCount,
      was_truncated: t2.wasLineTruncated,
      was_byte_truncated: t2.wasByteTruncated,
      memory_type: memoryType
    }), lines.push(`## ${ENTRYPOINT_NAME}`, "", t2.content);
  } else
    lines.push(`## ${ENTRYPOINT_NAME}`, "", `Your ${ENTRYPOINT_NAME} is currently empty. When you save new memories, they will appear here.`);
  return lines.join(`
`);
}
function buildSearchingPastContextSection(autoMemDir) {
  return [];
}
async function loadMemoryPrompt() {
  let autoEnabled = isAutoMemoryEnabled(), skipIndex = !1, coworkExtraGuidelines = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES, extraGuidelines = coworkExtraGuidelines && coworkExtraGuidelines.trim().length > 0 ? [coworkExtraGuidelines] : void 0;
  if (autoEnabled) {
    let autoDir = getAutoMemPath();
    return await ensureMemoryDirExists(autoDir), logMemoryDirCounts(autoDir, {
      memory_type: "auto"
    }), buildMemoryLines("auto memory", autoDir, extraGuidelines, !1).join(`
`);
  }
  return logEvent("tengu_memdir_disabled", {
    disabled_by_env_var: isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
    disabled_by_setting: !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && getInitialSettings().autoMemoryEnabled === !1
  }), null;
}
var ENTRYPOINT_NAME = "MEMORY.md", MAX_ENTRYPOINT_LINES = 200, MAX_ENTRYPOINT_BYTES = 25000, AUTO_MEM_DISPLAY_NAME = "auto memory", DIR_EXISTS_GUIDANCE = "This directory already exists \u2014 write to it directly with the Write tool (do not run mkdir or check for its existence).";
var init_memdir = __esm(() => {
  init_fsOperations();
  init_paths();
  init_debug();
  init_envUtils();
  init_format();
  init_settings2();
  init_memoryTypes();
});
