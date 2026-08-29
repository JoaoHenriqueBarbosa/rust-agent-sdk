// var: init_document_fragment
var init_document_fragment = __esm(() => {
  init_constants10();
  init_non_element_parent_node();
  DocumentFragment = class DocumentFragment extends NonElementParentNode {
    constructor(ownerDocument) {
      super(ownerDocument, "#document-fragment", DOCUMENT_FRAGMENT_NODE);
    }
  };
});
