// var: init_custom_event
var init_custom_event = __esm(() => {
  init_event();
  CustomEvent = class CustomEvent extends GlobalEvent {
    constructor(type, eventInitDict = {}) {
      super(type, eventInitDict);
      this.detail = eventInitDict.detail;
    }
  };
});
