// Original: src/utils/bash/specs/nohup.ts
var nohup, nohup_default;
var init_nohup = __esm(() => {
  nohup = {
    name: "nohup",
    description: "Run a command immune to hangups",
    args: {
      name: "command",
      description: "Command to run with nohup",
      isCommand: !0
    }
  }, nohup_default = nohup;
});
