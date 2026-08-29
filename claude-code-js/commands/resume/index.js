// Original: src/commands/resume/index.ts
var resume, resume_default;
var init_resume2 = __esm(() => {
  resume = {
    type: "local-jsx",
    name: "resume",
    description: "Resume a previous conversation",
    aliases: ["continue"],
    argumentHint: "[conversation id or search term]",
    load: () => Promise.resolve().then(() => (init_resume(), exports_resume))
  }, resume_default = resume;
});
