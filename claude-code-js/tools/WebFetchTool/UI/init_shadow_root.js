// var: init_shadow_root
var init_shadow_root = __esm(() => {
  init_constants10();
  init_inner_html();
  init_non_element_parent_node();
  ShadowRoot = class ShadowRoot extends NonElementParentNode {
    constructor(host) {
      super(host.ownerDocument, "#shadow-root", DOCUMENT_FRAGMENT_NODE);
      this.host = host;
    }
    get innerHTML() {
      return getInnerHtml(this);
    }
    set innerHTML(html2) {
      setInnerHtml(this, html2);
    }
  };
});
