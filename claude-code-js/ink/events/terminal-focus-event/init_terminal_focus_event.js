// var: init_terminal_focus_event
var init_terminal_focus_event = __esm(() => {
  TerminalFocusEvent = class TerminalFocusEvent extends Event2 {
    type;
    constructor(type) {
      super();
      this.type = type;
    }
  };
});
