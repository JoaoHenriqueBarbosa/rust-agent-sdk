// Original: src/utils/bash/specs/sleep.ts
var sleep5, sleep_default;
var init_sleep = __esm(() => {
  sleep5 = {
    name: "sleep",
    description: "Delay for a specified amount of time",
    args: {
      name: "duration",
      description: "Duration to sleep (seconds or with suffix like 5s, 2m, 1h)",
      isOptional: !1
    }
  }, sleep_default = sleep5;
});
