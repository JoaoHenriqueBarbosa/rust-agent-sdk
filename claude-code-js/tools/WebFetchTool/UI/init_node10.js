// var: init_node10
var init_node10 = __esm(() => {
  init_esm26();
  DataNode = class DataNode extends Node2 {
    constructor(data) {
      super();
      this.data = data;
    }
    get nodeValue() {
      return this.data;
    }
    set nodeValue(data) {
      this.data = data;
    }
  };
  Text4 = class Text4 extends DataNode {
    constructor() {
      super(...arguments);
      this.type = ElementType.Text;
    }
    get nodeType() {
      return 3;
    }
  };
  Comment2 = class Comment2 extends DataNode {
    constructor() {
      super(...arguments);
      this.type = ElementType.Comment;
    }
    get nodeType() {
      return 8;
    }
  };
  ProcessingInstruction = class ProcessingInstruction extends DataNode {
    constructor(name3, data) {
      super(data);
      this.name = name3, this.type = ElementType.Directive;
    }
    get nodeType() {
      return 1;
    }
  };
  NodeWithChildren = class NodeWithChildren extends Node2 {
    constructor(children) {
      super();
      this.children = children;
    }
    get firstChild() {
      var _a4;
      return (_a4 = this.children[0]) !== null && _a4 !== void 0 ? _a4 : null;
    }
    get lastChild() {
      return this.children.length > 0 ? this.children[this.children.length - 1] : null;
    }
    get childNodes() {
      return this.children;
    }
    set childNodes(children) {
      this.children = children;
    }
  };
  CDATA2 = class CDATA2 extends NodeWithChildren {
    constructor() {
      super(...arguments);
      this.type = ElementType.CDATA;
    }
    get nodeType() {
      return 4;
    }
  };
  Document = class Document extends NodeWithChildren {
    constructor() {
      super(...arguments);
      this.type = ElementType.Root;
    }
    get nodeType() {
      return 9;
    }
  };
  Element = class Element extends NodeWithChildren {
    constructor(name3, attribs, children = [], type = name3 === "script" ? ElementType.Script : name3 === "style" ? ElementType.Style : ElementType.Tag) {
      super(children);
      this.name = name3, this.attribs = attribs, this.type = type;
    }
    get nodeType() {
      return 1;
    }
    get tagName() {
      return this.name;
    }
    set tagName(name3) {
      this.name = name3;
    }
    get attributes() {
      return Object.keys(this.attribs).map((name3) => {
        var _a4, _b2;
        return {
          name: name3,
          value: this.attribs[name3],
          namespace: (_a4 = this["x-attribsNamespace"]) === null || _a4 === void 0 ? void 0 : _a4[name3],
          prefix: (_b2 = this["x-attribsPrefix"]) === null || _b2 === void 0 ? void 0 : _b2[name3]
        };
      });
    }
  };
});
