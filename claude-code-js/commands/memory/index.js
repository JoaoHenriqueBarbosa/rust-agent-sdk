// Original: src/commands/memory/index.ts
var memory, memory_default;
var init_memory2 = __esm(() => {
  memory = {
    type: "local-jsx",
    name: "memory",
    description: "Edit Claude memory files",
    load: () => Promise.resolve().then(() => (init_memory(), exports_memory))
  }, memory_default = memory;
});
