// Original: src/utils/mcpInstructionsDelta.ts
function isMcpInstructionsDeltaEnabled() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_MCP_INSTR_DELTA))
    return !0;
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_MCP_INSTR_DELTA))
    return !1;
  return !1;
}
function getMcpInstructionsDelta(mcpClients, messages, clientSideInstructions) {
  let announced = /* @__PURE__ */ new Set, attachmentCount = 0, midCount = 0;
  for (let msg of messages) {
    if (msg.type !== "attachment")
      continue;
    if (attachmentCount++, msg.attachment.type !== "mcp_instructions_delta")
      continue;
    midCount++;
    for (let n5 of msg.attachment.addedNames)
      announced.add(n5);
    for (let n5 of msg.attachment.removedNames)
      announced.delete(n5);
  }
  let connected = mcpClients.filter((c3) => c3.type === "connected"), connectedNames = new Set(connected.map((c3) => c3.name)), blocks = /* @__PURE__ */ new Map;
  for (let c3 of connected)
    if (c3.instructions)
      blocks.set(c3.name, `## ${c3.name}
${c3.instructions}`);
  for (let ci of clientSideInstructions) {
    if (!connectedNames.has(ci.serverName))
      continue;
    let existing = blocks.get(ci.serverName);
    blocks.set(ci.serverName, existing ? `${existing}

${ci.block}` : `## ${ci.serverName}
${ci.block}`);
  }
  let added = [];
  for (let [name3, block2] of blocks)
    if (!announced.has(name3))
      added.push({ name: name3, block: block2 });
  let removed = [];
  for (let n5 of announced)
    if (!connectedNames.has(n5))
      removed.push(n5);
  if (added.length === 0 && removed.length === 0)
    return null;
  return logEvent("tengu_mcp_instructions_pool_change", {
    addedCount: added.length,
    removedCount: removed.length,
    priorAnnouncedCount: announced.size,
    clientSideCount: clientSideInstructions.length,
    messagesLength: messages.length,
    attachmentCount,
    midCount
  }), added.sort((a2, b) => a2.name.localeCompare(b.name)), {
    addedNames: added.map((a2) => a2.name),
    addedBlocks: added.map((a2) => a2.block),
    removedNames: removed.sort()
  };
}
var init_mcpInstructionsDelta = __esm(() => {
  init_envUtils();
});
