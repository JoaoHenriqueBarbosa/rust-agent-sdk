// function: collectReadToolFilePaths
function collectReadToolFilePaths(messages) {
  let stubIds = /* @__PURE__ */ new Set;
  for (let message of messages) {
    if (message.type !== "user" || !Array.isArray(message.message.content))
      continue;
    for (let block2 of message.message.content)
      if (block2.type === "tool_result" && typeof block2.content === "string" && block2.content.startsWith(FILE_UNCHANGED_STUB))
        stubIds.add(block2.tool_use_id);
  }
  let paths2 = /* @__PURE__ */ new Set;
  for (let message of messages) {
    if (message.type !== "assistant" || !Array.isArray(message.message.content))
      continue;
    for (let block2 of message.message.content) {
      if (block2.type !== "tool_use" || block2.name !== FILE_READ_TOOL_NAME || stubIds.has(block2.id))
        continue;
      let input = block2.input;
      if (input && typeof input === "object" && "file_path" in input && typeof input.file_path === "string")
        paths2.add(expandPath(input.file_path));
    }
  }
  return paths2;
}
