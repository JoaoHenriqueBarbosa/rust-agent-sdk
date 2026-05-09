// Original: src/commands/exit/index.ts
var exit, exit_default;
var init_exit2 = __esm(() => {
  exit = {
    type: "local-jsx",
    name: "exit",
    aliases: ["quit"],
    description: "Exit the REPL",
    immediate: !0,
    load: () => Promise.resolve().then(() => (init_exit(), exports_exit))
  }, exit_default = exit;
});
