// Original: src/skills/bundled/verifyContent.ts
var SKILL_MD, SKILL_FILES;
var init_verifyContent = __esm(() => {
  init_cli();
  init_server2();
  init_SKILL();
  SKILL_MD = SKILL_default, SKILL_FILES = {
    "examples/cli.md": cli_default,
    "examples/server.md": server_default
  };
});
