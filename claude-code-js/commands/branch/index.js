// Original: src/commands/branch/index.ts
var branch, branch_default;
var init_branch2 = __esm(() => {
  branch = {
    type: "local-jsx",
    name: "branch",
    aliases: ["fork"],
    description: "Create a branch of the current conversation at this point",
    argumentHint: "[name]",
    load: () => Promise.resolve().then(() => (init_branch(), exports_branch))
  }, branch_default = branch;
});
