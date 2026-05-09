// var: init_token_list
var init_token_list = __esm(() => {
  init_symbols();
  init_attributes();
  init_attr();
  ({ add } = Set.prototype);
  DOMTokenList = class DOMTokenList extends Set {
    constructor(ownerElement) {
      super();
      this[OWNER_ELEMENT] = ownerElement;
      let attribute2 = ownerElement.getAttributeNode("class");
      if (attribute2)
        addTokens(this, attribute2.value.split(/\s+/));
    }
    get length() {
      return this.size;
    }
    get value() {
      return [...this].join(" ");
    }
    add(...tokens) {
      addTokens(this, tokens), update(this);
    }
    contains(token) {
      return this.has(token);
    }
    remove(...tokens) {
      for (let token of tokens)
        this.delete(token);
      update(this);
    }
    toggle(token, force) {
      if (this.has(token)) {
        if (force)
          return !0;
        this.delete(token), update(this);
      } else if (force || arguments.length === 1)
        return super.add(token), update(this), !0;
      return !1;
    }
    replace(token, newToken) {
      if (this.has(token))
        return this.delete(token), super.add(newToken), update(this), !0;
      return !1;
    }
    supports() {
      return !0;
    }
  };
});
