// var: init_text
var init_text = __esm(() => {
  init_constants10();
  init_symbols();
  init_text_escaper();
  init_character_data();
  Text5 = class Text5 extends CharacterData {
    constructor(ownerDocument, data = "") {
      super(ownerDocument, "#text", TEXT_NODE, data);
    }
    get wholeText() {
      let text2 = [], { previousSibling: previousSibling2, nextSibling: nextSibling2 } = this;
      while (previousSibling2) {
        if (previousSibling2.nodeType === TEXT_NODE)
          text2.unshift(previousSibling2[VALUE]);
        else
          break;
        previousSibling2 = previousSibling2.previousSibling;
      }
      text2.push(this[VALUE]);
      while (nextSibling2) {
        if (nextSibling2.nodeType === TEXT_NODE)
          text2.push(nextSibling2[VALUE]);
        else
          break;
        nextSibling2 = nextSibling2.nextSibling;
      }
      return text2.join("");
    }
    cloneNode() {
      let { ownerDocument, [VALUE]: data } = this;
      return new Text5(ownerDocument, data);
    }
    toString() {
      return escape4(this[VALUE]);
    }
  };
});
