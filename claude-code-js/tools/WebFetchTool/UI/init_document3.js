// var: init_document3
var init_document3 = __esm(() => {
  init_symbols();
  init_document();
  SVGDocument = class SVGDocument extends Document2 {
    constructor() {
      super("image/svg+xml");
    }
    toString() {
      return this[MIME].docType + super.toString();
    }
  };
});
