// var: require_dist_cjs83
var require_dist_cjs83 = __commonJS((exports) => {
  var xmlParser = require_xml_parser(), ATTR_ESCAPE_RE = /[&<>"]/g, ATTR_ESCAPE_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function escapeAttribute(value) {
    return value.replace(ATTR_ESCAPE_RE, (ch) => ATTR_ESCAPE_MAP[ch]);
  }
  var ELEMENT_ESCAPE_RE = /[&"'<>\r\n\u0085\u2028]/g, ELEMENT_ESCAPE_MAP = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    "<": "&lt;",
    ">": "&gt;",
    "\r": "&#x0D;",
    "\n": "&#x0A;",
    "\x85": "&#x85;",
    "\u2028": "&#x2028;"
  };
  function escapeElement(value) {
    return value.replace(ELEMENT_ESCAPE_RE, (ch) => ELEMENT_ESCAPE_MAP[ch]);
  }

  class XmlText {
    value;
    constructor(value) {
      this.value = value;
    }
    toString() {
      return escapeElement("" + this.value);
    }
  }

  class XmlNode {
    name;
    children;
    attributes = {};
    static of(name, childText, withName) {
      let node = new XmlNode(name);
      if (childText !== void 0)
        node.addChildNode(new XmlText(childText));
      if (withName !== void 0)
        node.withName(withName);
      return node;
    }
    constructor(name, children = []) {
      this.name = name, this.children = children;
    }
    withName(name) {
      return this.name = name, this;
    }
    addAttribute(name, value) {
      return this.attributes[name] = value, this;
    }
    addChildNode(child) {
      return this.children.push(child), this;
    }
    removeAttribute(name) {
      return delete this.attributes[name], this;
    }
    n(name) {
      return this.name = name, this;
    }
    c(child) {
      return this.children.push(child), this;
    }
    a(name, value) {
      if (value != null)
        this.attributes[name] = value;
      return this;
    }
    cc(input, field, withName = field) {
      if (input[field] != null) {
        let node = XmlNode.of(field, input[field]).withName(withName);
        this.c(node);
      }
    }
    l(input, listName, memberName, valueProvider) {
      if (input[listName] != null)
        valueProvider().map((node) => {
          node.withName(memberName), this.c(node);
        });
    }
    lc(input, listName, memberName, valueProvider) {
      if (input[listName] != null) {
        let nodes = valueProvider(), containerNode = new XmlNode(memberName);
        nodes.map((node) => {
          containerNode.c(node);
        }), this.c(containerNode);
      }
    }
    toString() {
      let hasChildren = Boolean(this.children.length), xmlText = `<${this.name}`, attributes = this.attributes;
      for (let attributeName of Object.keys(attributes)) {
        let attribute = attributes[attributeName];
        if (attribute != null)
          xmlText += ` ${attributeName}="${escapeAttribute("" + attribute)}"`;
      }
      return xmlText += !hasChildren ? "/>" : `>${this.children.map((c3) => c3.toString()).join("")}</${this.name}>`;
    }
  }
  exports.parseXML = xmlParser.parseXML;
  exports.XmlNode = XmlNode;
  exports.XmlText = XmlText;
});
