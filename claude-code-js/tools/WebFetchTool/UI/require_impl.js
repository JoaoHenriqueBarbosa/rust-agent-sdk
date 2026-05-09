// var: require_impl
var require_impl = __commonJS((exports, module) => {
  var utils = require_utils12();
  exports = module.exports = {
    CSSStyleDeclaration: require_CSSStyleDeclaration2(),
    CharacterData: require_CharacterData(),
    Comment: require_Comment(),
    DOMException: require_DOMException(),
    DOMImplementation: require_DOMImplementation(),
    DOMTokenList: require_DOMTokenList(),
    Document: require_Document2(),
    DocumentFragment: require_DocumentFragment(),
    DocumentType: require_DocumentType(),
    Element: require_Element(),
    HTMLParser: require_HTMLParser(),
    NamedNodeMap: require_NamedNodeMap(),
    Node: require_Node2(),
    NodeList: require_NodeList(),
    NodeFilter: require_NodeFilter(),
    ProcessingInstruction: require_ProcessingInstruction(),
    Text: require_Text(),
    Window: require_Window()
  };
  utils.merge(exports, require_events2());
  utils.merge(exports, require_htmlelts().elements);
  utils.merge(exports, require_svg().elements);
});
