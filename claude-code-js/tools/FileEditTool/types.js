// Original: src/tools/FileEditTool/types.ts
var inputSchema12, hunkSchema, gitDiffSchema, outputSchema9;
var init_types20 = __esm(() => {
  init_v4();
  init_semanticBoolean();
  inputSchema12 = lazySchema(() => exports_external.strictObject({
    file_path: exports_external.string().describe("The absolute path to the file to modify"),
    old_string: exports_external.string().describe("The text to replace"),
    new_string: exports_external.string().describe("The text to replace it with (must be different from old_string)"),
    replace_all: semanticBoolean(exports_external.boolean().default(!1).optional()).describe("Replace all occurrences of old_string (default false)")
  })), hunkSchema = lazySchema(() => exports_external.object({
    oldStart: exports_external.number(),
    oldLines: exports_external.number(),
    newStart: exports_external.number(),
    newLines: exports_external.number(),
    lines: exports_external.array(exports_external.string())
  })), gitDiffSchema = lazySchema(() => exports_external.object({
    filename: exports_external.string(),
    status: exports_external.enum(["modified", "added"]),
    additions: exports_external.number(),
    deletions: exports_external.number(),
    changes: exports_external.number(),
    patch: exports_external.string(),
    repository: exports_external.string().nullable().optional().describe("GitHub owner/repo when available")
  })), outputSchema9 = lazySchema(() => exports_external.object({
    filePath: exports_external.string().describe("The file path that was edited"),
    oldString: exports_external.string().describe("The original string that was replaced"),
    newString: exports_external.string().describe("The new string that replaced it"),
    originalFile: exports_external.string().describe("The original file contents before editing"),
    structuredPatch: exports_external.array(hunkSchema()).describe("Diff patch showing the changes"),
    userModified: exports_external.boolean().describe("Whether the user modified the proposed changes"),
    replaceAll: exports_external.boolean().describe("Whether all occurrences were replaced"),
    gitDiff: gitDiffSchema().optional()
  }));
});
