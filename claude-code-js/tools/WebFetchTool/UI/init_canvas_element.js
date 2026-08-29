// var: init_canvas_element
var init_canvas_element = __esm(() => {
  init_symbols();
  init_register_html_class();
  init_attributes();
  init_element3();
  import_canvas = __toESM(require_canvas(), 1), { createCanvas } = import_canvas.default;
  HTMLCanvasElement = class HTMLCanvasElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName7) {
      super(ownerDocument, localName);
      this[IMAGE] = createCanvas(300, 150);
    }
    get width() {
      return this[IMAGE].width;
    }
    set width(value) {
      numericAttribute.set(this, "width", value), this[IMAGE].width = value;
    }
    get height() {
      return this[IMAGE].height;
    }
    set height(value) {
      numericAttribute.set(this, "height", value), this[IMAGE].height = value;
    }
    getContext(type) {
      return this[IMAGE].getContext(type);
    }
    toDataURL(...args) {
      return this[IMAGE].toDataURL(...args);
    }
  };
  registerHTMLClass(tagName7, HTMLCanvasElement);
});
