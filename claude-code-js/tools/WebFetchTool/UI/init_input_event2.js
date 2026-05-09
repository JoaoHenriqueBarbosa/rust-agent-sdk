// var: init_input_event2
var init_input_event2 = __esm(() => {
  init_event();
  InputEvent2 = class InputEvent2 extends GlobalEvent {
    constructor(type, inputEventInit = {}) {
      super(type, inputEventInit);
      this.inputType = inputEventInit.inputType, this.data = inputEventInit.data, this.dataTransfer = inputEventInit.dataTransfer, this.isComposing = inputEventInit.isComposing || !1, this.ranges = inputEventInit.ranges;
    }
  };
});
