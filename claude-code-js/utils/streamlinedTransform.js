// Original: src/utils/streamlinedTransform.ts
var COMMAND_TOOLS;
var init_streamlinedTransform = __esm(() => {
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_prompt6();
  init_messages3();
  init_shellToolUtils();
  COMMAND_TOOLS = [...SHELL_TOOL_NAMES, "Tmux", TASK_STOP_TOOL_NAME];
});
