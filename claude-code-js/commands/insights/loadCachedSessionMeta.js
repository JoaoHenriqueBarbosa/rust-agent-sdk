// function: loadCachedSessionMeta
async function loadCachedSessionMeta(sessionId) {
  let metaPath = join133(getSessionMetaDir(), `${sessionId}.json`);
  try {
    let content = await readFile50(metaPath, { encoding: "utf-8" });
    return jsonParse(content);
  } catch {
    return null;
  }
}
