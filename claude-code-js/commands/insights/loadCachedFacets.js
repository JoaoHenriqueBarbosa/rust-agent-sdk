// function: loadCachedFacets
async function loadCachedFacets(sessionId) {
  let facetPath = join133(getFacetsDir(), `${sessionId}.json`);
  try {
    let content = await readFile50(facetPath, { encoding: "utf-8" }), parsed = jsonParse(content);
    if (!isValidSessionFacets(parsed)) {
      try {
        await unlink19(facetPath);
      } catch {}
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
