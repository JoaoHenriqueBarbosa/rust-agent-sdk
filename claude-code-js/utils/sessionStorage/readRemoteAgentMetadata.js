// function: readRemoteAgentMetadata
async function readRemoteAgentMetadata(taskId) {
  let path25 = getRemoteAgentMetadataPath(taskId);
  try {
    let raw = await readFile51(path25, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    if (isFsInaccessible(e))
      return null;
    throw e;
  }
}
