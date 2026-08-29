// Original: src/ink/events/focus-event.ts
var FocusEvent;
var init_focus_event = __esm(() => {
  init_terminal_event();
  FocusEvent = class FocusEvent extends TerminalEvent {
    relatedTarget;
    constructor(type, relatedTarget = null) {
      super(type, { bubbles: !0, cancelable: !1 });
      this.relatedTarget = relatedTarget;
    }
  };
});
