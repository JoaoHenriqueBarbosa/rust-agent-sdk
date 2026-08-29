// function: writeRemoteAgentMetadata
async function writeRemoteAgentMetadata(taskId, metadata) {
  let path25 = getRemoteAgentMetadataPath(taskId);
  await mkdir37(dirname58(path25), { recursive: !0 }), await writeFile43(path25, JSON.stringify(metadata));
}
