// Original: src/constants/xml.ts
var COMMAND_NAME_TAG = "command-name", COMMAND_MESSAGE_TAG = "command-message", COMMAND_ARGS_TAG = "command-args", BASH_INPUT_TAG = "bash-input", BASH_STDOUT_TAG = "bash-stdout", BASH_STDERR_TAG = "bash-stderr", LOCAL_COMMAND_STDOUT_TAG = "local-command-stdout", LOCAL_COMMAND_STDERR_TAG = "local-command-stderr", LOCAL_COMMAND_CAVEAT_TAG = "local-command-caveat", TICK_TAG = "tick", TASK_NOTIFICATION_TAG = "task-notification", TASK_ID_TAG = "task-id", TOOL_USE_ID_TAG = "tool-use-id", TASK_TYPE_TAG = "task-type", OUTPUT_FILE_TAG = "output-file", STATUS_TAG = "status", SUMMARY_TAG = "summary", WORKTREE_TAG = "worktree", WORKTREE_PATH_TAG = "worktreePath", WORKTREE_BRANCH_TAG = "worktreeBranch", REMOTE_REVIEW_TAG = "remote-review", REMOTE_REVIEW_PROGRESS_TAG = "remote-review-progress", TEAMMATE_MESSAGE_TAG = "teammate-message", CHANNEL_TAG = "channel", FORK_BOILERPLATE_TAG = "fork-boilerplate", FORK_DIRECTIVE_PREFIX = "Your directive: ", COMMON_HELP_ARGS, COMMON_INFO_ARGS;
var init_xml = __esm(() => {
  COMMON_HELP_ARGS = ["help", "-h", "--help"], COMMON_INFO_ARGS = [
    "list",
    "show",
    "display",
    "current",
    "view",
    "get",
    "check",
    "describe",
    "print",
    "version",
    "about",
    "status",
    "?"
  ];
});
