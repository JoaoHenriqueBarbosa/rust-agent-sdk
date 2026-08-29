// Original: src/utils/bash/specs/timeout.ts
var timeout, timeout_default;
var init_timeout2 = __esm(() => {
  timeout = {
    name: "timeout",
    description: "Run a command with a time limit",
    args: [
      {
        name: "duration",
        description: "Duration to wait before timing out (e.g., 10, 5s, 2m)",
        isOptional: !1
      },
      {
        name: "command",
        description: "Command to run",
        isCommand: !0
      }
    ]
  }, timeout_default = timeout;
});
