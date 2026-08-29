// function: readAgentMetadata
async function readAgentMetadata(agentId) {
  let path25 = getAgentMetadataPath(agentId);
  try {
    let raw = await readFile51(path25, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    if (isFsInaccessible(e))
      return null;
    throw e;
  }
}
