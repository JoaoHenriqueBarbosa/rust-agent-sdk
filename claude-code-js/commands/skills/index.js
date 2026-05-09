// Original: src/commands/skills/index.ts
var skills, skills_default;
var init_skills2 = __esm(() => {
  skills = {
    type: "local-jsx",
    name: "skills",
    description: "List available skills",
    load: () => Promise.resolve().then(() => (init_skills(), exports_skills))
  }, skills_default = skills;
});
