// var: init_document2
var init_document2 = __esm(() => {
  init_constants10();
  init_symbols();
  init_register_html_class();
  init_document();
  init_node_list();
  init_custom_element_registry();
  init_element3();
  HTMLDocument = class HTMLDocument extends Document2 {
    constructor() {
      super("text/html");
    }
    get all() {
      let nodeList = new NodeList, { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        switch (next.nodeType) {
          case ELEMENT_NODE:
            nodeList.push(next);
            break;
        }
        next = next[NEXT];
      }
      return nodeList;
    }
    get head() {
      let { documentElement } = this, { firstElementChild } = documentElement;
      if (!firstElementChild || firstElementChild.tagName !== "HEAD")
        firstElementChild = this.createElement("head"), documentElement.prepend(firstElementChild);
      return firstElementChild;
    }
    get body() {
      let { head } = this, { nextElementSibling: nextElementSibling3 } = head;
      if (!nextElementSibling3 || nextElementSibling3.tagName !== "BODY")
        nextElementSibling3 = this.createElement("body"), head.after(nextElementSibling3);
      return nextElementSibling3;
    }
    get title() {
      let { head } = this;
      return head.getElementsByTagName("title").at(0)?.textContent || "";
    }
    set title(textContent2) {
      let { head } = this, title = head.getElementsByTagName("title").at(0);
      if (title)
        title.textContent = textContent2;
      else
        head.insertBefore(this.createElement("title"), head.firstChild).textContent = textContent2;
    }
    createElement(localName, options2) {
      let builtin = !!(options2 && options2.is), element = createHTMLElement(this, builtin, localName, options2);
      if (builtin)
        element.setAttribute("is", options2.is);
      return element;
    }
  };
});
