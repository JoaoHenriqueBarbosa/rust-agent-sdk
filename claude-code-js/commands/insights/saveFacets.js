// function: saveFacets
async function saveFacets(facets) {
  try {
    await mkdir36(getFacetsDir(), { recursive: !0 });
  } catch {}
  let facetPath = join133(getFacetsDir(), `${facets.session_id}.json`);
  await writeFile42(facetPath, jsonStringify(facets, null, 2), {
    encoding: "utf-8",
    mode: 384
  });
}
