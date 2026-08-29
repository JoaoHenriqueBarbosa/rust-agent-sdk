// var: init_dist8
var init_dist8 = __esm(() => {
  ParseError = class ParseError extends Error {
    constructor(message, options2) {
      super(message), this.name = "ParseError", this.type = options2.type, this.field = options2.field, this.value = options2.value, this.line = options2.line;
    }
  };
});
