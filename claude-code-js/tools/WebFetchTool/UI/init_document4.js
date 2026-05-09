// var: init_document4
var init_document4 = __esm(() => {
  init_symbols();
  init_document();
  XMLDocument = class XMLDocument extends Document2 {
    constructor() {
      super("text/xml");
    }
    toString() {
      return this[MIME].docType + super.toString();
    }
  };
});
