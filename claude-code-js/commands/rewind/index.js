// Original: src/commands/rewind/index.ts
var rewind, rewind_default;
var init_rewind = __esm(() => {
  rewind = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    argumentHint: "",
    type: "local",
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => exports_rewind)
  }, rewind_default = rewind;
});
