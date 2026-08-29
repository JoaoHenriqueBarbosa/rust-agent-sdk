// Original: src/commands/tasks/index.ts
var tasks, tasks_default;
var init_tasks4 = __esm(() => {
  tasks = {
    type: "local-jsx",
    name: "tasks",
    aliases: ["bashes"],
    description: "List and manage background tasks",
    load: () => Promise.resolve().then(() => (init_tasks3(), exports_tasks))
  }, tasks_default = tasks;
});
