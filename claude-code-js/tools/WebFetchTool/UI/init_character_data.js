// var: init_character_data
var init_character_data = __esm(() => {
  init_symbols();
  init_utils14();
  init_node12();
  init_jsdon();
  init_non_document_type_child_node();
  init_child_node();
  init_node11();
  init_mutation_observer();
  CharacterData = class CharacterData extends Node3 {
    constructor(ownerDocument, localName, nodeType, data) {
      super(ownerDocument, localName, nodeType);
      this[VALUE] = $String(data);
    }
    get isConnected() {
      return isConnected2(this);
    }
    get parentElement() {
      return parentElement(this);
    }
    get previousSibling() {
      return previousSibling(this);
    }
    get nextSibling() {
      return nextSibling(this);
    }
    get previousElementSibling() {
      return previousElementSibling(this);
    }
    get nextElementSibling() {
      return nextElementSibling2(this);
    }
    before(...nodes) {
      before(this, nodes);
    }
    after(...nodes) {
      after(this, nodes);
    }
    replaceWith(...nodes) {
      replaceWith(this, nodes);
    }
    remove() {
      remove2(this[PREV], this, this[NEXT]);
    }
    get data() {
      return this[VALUE];
    }
    set data(value) {
      this[VALUE] = $String(value), moCallback(this, this.parentNode);
    }
    get nodeValue() {
      return this.data;
    }
    set nodeValue(value) {
      this.data = value;
    }
    get textContent() {
      return this.data;
    }
    set textContent(value) {
      this.data = value;
    }
    get length() {
      return this.data.length;
    }
    substringData(offset, count3) {
      return this.data.substr(offset, count3);
    }
    appendData(data) {
      this.data += data;
    }
    insertData(offset, data) {
      let { data: t2 } = this;
      this.data = t2.slice(0, offset) + data + t2.slice(offset);
    }
    deleteData(offset, count3) {
      let { data: t2 } = this;
      this.data = t2.slice(0, offset) + t2.slice(offset + count3);
    }
    replaceData(offset, count3, data) {
      let { data: t2 } = this;
      this.data = t2.slice(0, offset) + data + t2.slice(offset + count3);
    }
    toJSON() {
      let json2 = [];
      return characterDataAsJSON(this, json2), json2;
    }
  };
});
