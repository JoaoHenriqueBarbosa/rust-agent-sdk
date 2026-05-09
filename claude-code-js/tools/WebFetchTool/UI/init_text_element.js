// var: init_text_element
var init_text_element = __esm(() => {
  init_element3();
  ({ toString: toString5 } = HTMLElement.prototype);
  TextElement = class TextElement extends HTMLElement {
    get innerHTML() {
      return this.textContent;
    }
    set innerHTML(html2) {
      this.textContent = html2;
    }
    toString() {
      return toString5.call(this.cloneNode()).replace("><", () => `>${this.textContent}<`);
    }
  };
});
