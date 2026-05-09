// var: init_element2
var init_element2 = __esm(() => {
  init_element();
  init_utils14();
  classNames = /* @__PURE__ */ new WeakMap, handler3 = {
    get(target, name3) {
      return target[name3];
    },
    set(target, name3, value) {
      return target[name3] = value, !0;
    }
  };
  SVGElement = class SVGElement extends Element2 {
    constructor(ownerDocument, localName, ownerSVGElement = null) {
      super(ownerDocument, localName);
      this.ownerSVGElement = ownerSVGElement;
    }
    get className() {
      if (!classNames.has(this))
        classNames.set(this, new Proxy({ baseVal: "", animVal: "" }, handler3));
      return classNames.get(this);
    }
    set className(value) {
      let { classList } = this;
      classList.clear(), classList.add(...$String(value).split(/\s+/));
    }
    get namespaceURI() {
      return "http://www.w3.org/2000/svg";
    }
    getAttribute(name3) {
      return name3 === "class" ? [...this.classList].join(" ") : super.getAttribute(name3);
    }
    setAttribute(name3, value) {
      if (name3 === "class")
        this.className = value;
      else if (name3 === "style") {
        let { className } = this;
        className.baseVal = className.animVal = value;
      }
      super.setAttribute(name3, value);
    }
  };
});
