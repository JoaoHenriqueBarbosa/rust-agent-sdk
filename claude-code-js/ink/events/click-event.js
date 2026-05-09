// Original: src/ink/events/click-event.ts
var ClickEvent;
var init_click_event = __esm(() => {
  ClickEvent = class ClickEvent extends Event2 {
    col;
    row;
    localCol = 0;
    localRow = 0;
    cellIsBlank;
    constructor(col, row, cellIsBlank) {
      super();
      this.col = col, this.row = row, this.cellIsBlank = cellIsBlank;
    }
  };
});
