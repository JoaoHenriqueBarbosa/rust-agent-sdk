// Original: src/skills/bundled/index.ts
function initBundledSkills() {
  if (registerUpdateConfigSkill(), registerKeybindingsSkill(), registerVerifySkill(), registerDebugSkill(), registerLoremIpsumSkill(), registerSkillifySkill(), registerRememberSkill(), registerSimplifySkill(), registerBatchSkill(), registerStuckSkill(), shouldAutoEnableClaudeInChrome())
    registerClaudeInChromeSkill();
}
var init_bundled = __esm(() => {
  init_setup2();
  init_batch();
  init_claudeInChrome();
  init_debug3();
  init_keybindings3();
  init_loremIpsum();
  init_remember();
  init_simplify();
  init_skillify();
  init_stuck();
  init_updateConfig();
  init_verify();
});
