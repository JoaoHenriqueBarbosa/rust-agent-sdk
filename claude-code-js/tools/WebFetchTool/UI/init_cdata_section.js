// var: init_cdata_section
var init_cdata_section = __esm(() => {
  init_constants10();
  init_symbols();
  init_character_data();
  CDATASection = class CDATASection extends CharacterData {
    constructor(ownerDocument, data = "") {
      super(ownerDocument, "#cdatasection", CDATA_SECTION_NODE, data);
    }
    cloneNode() {
      let { ownerDocument, [VALUE]: data } = this;
      return new CDATASection(ownerDocument, data);
    }
    toString() {
      return `<![CDATA[${this[VALUE]}]]>`;
    }
  };
});
