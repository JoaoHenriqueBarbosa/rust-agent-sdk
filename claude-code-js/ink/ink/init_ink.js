// var: init_ink
var init_ink = __esm(() => {
  init_noop();
  init_throttle2();
  init_mjs();
  init_state();
  init_yoga_layout();
  init_debug();
  init_log3();
  init_colorize();
  init_App();
  init_dom();
  init_keyboard_event();
  init_focus();
  init_frame();
  init_hit_test();
  init_instances();
  init_log_update();
  init_node_cache();
  init_output2();
  init_reconciler();
  init_render_node_to_output();
  init_render_to_screen();
  init_renderer();
  init_screen();
  init_searchHighlight();
  init_selection();
  init_terminal();
  init_csi();
  init_dec();
  init_osc();
  init_useTerminalNotification();
  import_constants39 = __toESM(require_react_reconciler_constants_development(), 1), jsx_dev_runtime8 = __toESM(require_react_jsx_dev_runtime_development(), 1), ALT_SCREEN_ANCHOR_CURSOR = Object.freeze({
    x: 0,
    y: 0,
    visible: !1
  }), CURSOR_HOME_PATCH = Object.freeze({
    type: "stdout",
    content: CURSOR_HOME
  }), ERASE_THEN_HOME_PATCH = Object.freeze({
    type: "stdout",
    content: ERASE_SCREEN + CURSOR_HOME
  });
  CONSOLE_STDOUT_METHODS = ["log", "info", "debug", "dir", "dirxml", "count", "countReset", "group", "groupCollapsed", "groupEnd", "table", "time", "timeEnd", "timeLog"], CONSOLE_STDERR_METHODS = ["warn", "error", "trace"];
});
