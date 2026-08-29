// function: listRemoteAgentMetadata
async function listRemoteAgentMetadata() {
  let dir = getRemoteAgentsDir(), entries2;
  try {
    entries2 = await readdir27(dir, { withFileTypes: !0 });
  } catch (e) {
    if (isFsInaccessible(e))
      return [];
    throw e;
  }
  let results = [];
  for (let entry of entries2) {
    if (!entry.isFile() || !entry.name.endsWith(".meta.json"))
      continue;
    try {
      let raw = await readFile51(join134(dir, entry.name), "utf-8");
      results.push(JSON.parse(raw));
    } catch (e) {
      logForDebugging(`listRemoteAgentMetadata: skipping ${entry.name}: ${String(e)}`);
    }
  }
  return results;
}
