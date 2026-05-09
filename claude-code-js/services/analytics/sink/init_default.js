// var: init_default
var init_default = __esm(() => {
  init_figures();
  init_yoctocolors();
  ICONS = {
    command: ({ piped }) => piped ? "|" : "$",
    output: () => " ",
    ipc: () => "*",
    error: getFinalIcon,
    duration: getFinalIcon
  }, COLORS = {
    command: () => bold,
    output: () => identity2,
    ipc: () => identity2,
    error: ({ reject }) => reject ? redBright : yellowBright,
    duration: () => gray
  };
});
