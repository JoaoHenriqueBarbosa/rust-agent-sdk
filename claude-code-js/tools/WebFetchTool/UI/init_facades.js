// var: init_facades
var init_facades = __esm(() => {
  init_attr();
  init_character_data();
  init_cdata_section();
  init_comment();
  init_document_fragment();
  init_document_type();
  init_element();
  init_node11();
  init_shadow_root();
  init_text();
  init_element2();
  init_object2();
  setPrototypeOf(Attr2, Attr);
  Attr2.prototype = Attr.prototype;
  setPrototypeOf(CDATASection2, CDATASection);
  CDATASection2.prototype = CDATASection.prototype;
  setPrototypeOf(CharacterData2, CharacterData);
  CharacterData2.prototype = CharacterData.prototype;
  setPrototypeOf(Comment4, Comment3);
  Comment4.prototype = Comment3.prototype;
  setPrototypeOf(DocumentFragment2, DocumentFragment);
  DocumentFragment2.prototype = DocumentFragment.prototype;
  setPrototypeOf(DocumentType2, DocumentType);
  DocumentType2.prototype = DocumentType.prototype;
  setPrototypeOf(Element3, Element2);
  Element3.prototype = Element2.prototype;
  setPrototypeOf(Node4, Node3);
  Node4.prototype = Node3.prototype;
  setPrototypeOf(ShadowRoot2, ShadowRoot);
  ShadowRoot2.prototype = ShadowRoot.prototype;
  setPrototypeOf(Text6, Text5);
  Text6.prototype = Text5.prototype;
  setPrototypeOf(SVGElement2, SVGElement);
  SVGElement2.prototype = SVGElement.prototype;
  Facades = {
    Attr: Attr2,
    CDATASection: CDATASection2,
    CharacterData: CharacterData2,
    Comment: Comment4,
    DocumentFragment: DocumentFragment2,
    DocumentType: DocumentType2,
    Element: Element3,
    Node: Node4,
    ShadowRoot: ShadowRoot2,
    Text: Text6,
    SVGElement: SVGElement2
  };
});
