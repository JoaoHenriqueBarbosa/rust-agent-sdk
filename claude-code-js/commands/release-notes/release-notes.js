// Original: src/commands/release-notes/release-notes.ts
var exports_release_notes = {};
__export(exports_release_notes, {
  call: () => call28
});
function formatReleaseNotes(notes) {
  return notes.map(([version5, notes2]) => {
    let header = `Version ${version5}:`, bulletPoints = notes2.map((note) => `\xB7 ${note}`).join(`
`);
    return `${header}
${bulletPoints}`;
  }).join(`

`);
}
async function call28() {
  let freshNotes = [];
  try {
    let timeoutPromise = new Promise((_, reject2) => {
      setTimeout((rej) => rej(Error("Timeout")), 500, reject2);
    });
    await Promise.race([fetchAndStoreChangelog(), timeoutPromise]), freshNotes = getAllReleaseNotes(await getStoredChangelog());
  } catch {}
  if (freshNotes.length > 0)
    return { type: "text", value: formatReleaseNotes(freshNotes) };
  let cachedNotes = getAllReleaseNotes(await getStoredChangelog());
  if (cachedNotes.length > 0)
    return { type: "text", value: formatReleaseNotes(cachedNotes) };
  return {
    type: "text",
    value: `See the full changelog at: ${CHANGELOG_URL}`
  };
}
var init_release_notes = __esm(() => {
  init_releaseNotes();
});
