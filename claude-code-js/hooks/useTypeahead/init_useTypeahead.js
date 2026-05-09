// var: init_useTypeahead
var init_useTypeahead = __esm(() => {
  init_notifications();
  init_ink2();
  init_dist4();
  init_commands5();
  init_overlayContext();
  init_keyboard_event();
  init_ink2();
  init_KeybindingContext();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_AppState();
  init_agentSwarmsEnabled();
  init_argumentSubstitution();
  init_shellCompletion();
  init_format();
  init_sessionStorage();
  init_commandSuggestions();
  init_directoryCompletion();
  init_shellHistoryCompletion();
  init_slackChannelSuggestions();
  init_fileSuggestions();
  init_unifiedSuggestions();
  import_react238 = __toESM(require_react_development(), 1), jsx_dev_runtime413 = __toESM(require_react_jsx_dev_runtime_development(), 1), AT_TOKEN_HEAD_RE = /^@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*/u, PATH_CHAR_HEAD_RE = /^[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+/u, TOKEN_WITH_AT_RE = /(@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+)$/u, TOKEN_WITHOUT_AT_RE = /[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+$/u, HAS_AT_SYMBOL_RE = /(^|\s)@([\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|"[^"]*"?)$/u, HASH_CHANNEL_RE = /(^|\s)#([a-z0-9][a-z0-9_-]*)$/;
  DM_MEMBER_RE = /(^|\s)@[\w-]*$/;
});
