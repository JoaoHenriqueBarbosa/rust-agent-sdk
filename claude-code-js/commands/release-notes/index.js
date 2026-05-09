// Original: src/commands/release-notes/index.ts
var releaseNotes, release_notes_default;
var init_release_notes2 = __esm(() => {
  releaseNotes = {
    description: "View release notes",
    name: "release-notes",
    type: "local",
    supportsNonInteractive: !0,
    load: () => Promise.resolve().then(() => (init_release_notes(), exports_release_notes))
  }, release_notes_default = releaseNotes;
});
