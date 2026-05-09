// Original: src/skills/bundled/verify.ts
function registerVerifySkill() {
  return;
}
var frontmatter, SKILL_BODY, DESCRIPTION19;
var init_verify = __esm(() => {
  init_frontmatterParser();
  init_bundledSkills();
  init_verifyContent();
  ({ frontmatter, content: SKILL_BODY } = parseFrontmatter(SKILL_MD)), DESCRIPTION19 = typeof frontmatter.description === "string" ? frontmatter.description : "Verify a code change does what it should by running the app.";
});
