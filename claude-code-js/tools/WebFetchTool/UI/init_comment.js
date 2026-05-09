// var: init_comment
var init_comment = __esm(() => {
  init_constants10();
  init_symbols();
  init_character_data();
  Comment3 = class Comment3 extends CharacterData {
    constructor(ownerDocument, data = "") {
      super(ownerDocument, "#comment", COMMENT_NODE, data);
    }
    cloneNode() {
      let { ownerDocument, [VALUE]: data } = this;
      return new Comment3(ownerDocument, data);
    }
    toString() {
      return `<!--${this[VALUE]}-->`;
    }
  };
});
