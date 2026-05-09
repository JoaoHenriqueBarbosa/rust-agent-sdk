// function: saveSessionMeta
async function saveSessionMeta(meta) {
  try {
    await mkdir36(getSessionMetaDir(), { recursive: !0 });
  } catch {}
  let metaPath = join133(getSessionMetaDir(), `${meta.session_id}.json`);
  await writeFile42(metaPath, jsonStringify(meta, null, 2), {
    encoding: "utf-8",
    mode: 384
  });
}
