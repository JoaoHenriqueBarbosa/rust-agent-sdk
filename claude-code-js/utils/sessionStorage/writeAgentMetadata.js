// function: writeAgentMetadata
async function writeAgentMetadata(agentId, metadata) {
  let path25 = getAgentMetadataPath(agentId);
  await mkdir37(dirname58(path25), { recursive: !0 }), await writeFile43(path25, JSON.stringify(metadata));
}
