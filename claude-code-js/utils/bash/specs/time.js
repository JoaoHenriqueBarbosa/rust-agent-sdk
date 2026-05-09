// Original: src/utils/bash/specs/time.ts
var time3, time_default;
var init_time = __esm(() => {
  time3 = {
    name: "time",
    description: "Time a command",
    args: {
      name: "command",
      description: "Command to time",
      isCommand: !0
    }
  }, time_default = time3;
});
