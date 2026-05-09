// function: deleteRemoteAgentMetadata
async function deleteRemoteAgentMetadata(taskId) {
  let path25 = getRemoteAgentMetadataPath(taskId);
  try {
    await unlink20(path25);
  } catch (e) {
    if (isFsInaccessible(e))
      return;
    throw e;
  }
}
