// Original: src/ink.ts
var exports_ink = {};
__export(exports_ink, {
  wrapText: () => wrapText2,
  useThemeSetting: () => useThemeSetting,
  useTheme: () => useTheme,
  useTerminalViewport: () => useTerminalViewport,
  useTerminalTitle: () => useTerminalTitle,
  useTerminalFocus: () => useTerminalFocus,
  useTabStatus: () => useTabStatus,
  useStdin: () => use_stdin_default,
  useSelection: () => useSelection,
  usePreviewTheme: () => usePreviewTheme,
  useInterval: () => useInterval2,
  useInput: () => use_input_default,
  useApp: () => use_app_default,
  useAnimationTimer: () => useAnimationTimer,
  useAnimationFrame: () => useAnimationFrame,
  supportsTabStatus: () => supportsTabStatus,
  render: () => render,
  measureElement: () => measure_element_default,
  createRoot: () => createRoot2,
  color: () => color,
  ThemeProvider: () => ThemeProvider,
  Text: () => ThemedText,
  TerminalFocusEvent: () => TerminalFocusEvent,
  Spacer: () => Spacer,
  RawAnsi: () => RawAnsi,
  NoSelect: () => NoSelect,
  Newline: () => Newline,
  Link: () => Link,
  InputEvent: () => InputEvent,
  FocusManager: () => FocusManager,
  EventEmitter: () => EventEmitter3,
  Event: () => Event2,
  ClickEvent: () => ClickEvent,
  Button: () => Button_default,
  Box: () => ThemedBox_default,
  BaseText: () => Text,
  BaseBox: () => Box_default,
  Ansi: () => Ansi
});
function withTheme(node) {
  return import_react24.createElement(ThemeProvider, null, node);
}
async function render(node, options) {
  return root_default(withTheme(node), options);
}
async function createRoot2(options) {
  let root2 = await createRoot(options);
  return {
    ...root2,
    render: (node) => root2.render(withTheme(node))
  };
}
var import_react24;
var init_ink2 = __esm(() => {
  init_ThemeProvider();
  init_root();
  init_color();
  init_ThemedBox();
  init_ThemedText();
  init_ThemeProvider();
  init_Ansi();
  init_Box();
  init_Button();
  init_Link();
  init_Newline();
  init_NoSelect();
  init_RawAnsi();
  init_Spacer();
  init_Text();
  init_click_event();
  init_emitter();
  init_input_event();
  init_terminal_focus_event();
  init_focus();
  init_use_animation_frame();
  init_use_app();
  init_use_input();
  init_use_interval();
  init_use_selection();
  init_use_stdin();
  init_use_tab_status();
  init_use_terminal_focus();
  init_use_terminal_title();
  init_use_terminal_viewport();
  init_measure_element();
  init_osc();
  init_wrap_text();
  import_react24 = __toESM(require_react_development(), 1);
});
