// var: init_attributes
var init_attributes = __esm(() => {
  init_symbols();
  init_utils14();
  init_custom_element_registry();
  init_mutation_observer();
  emptyAttributes = /* @__PURE__ */ new Set([
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "class",
    "contenteditable",
    "controls",
    "default",
    "defer",
    "disabled",
    "draggable",
    "formnovalidate",
    "hidden",
    "id",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "style",
    "truespeed"
  ]), booleanAttribute = {
    get(element, name3) {
      return element.hasAttribute(name3);
    },
    set(element, name3, value) {
      if (value)
        element.setAttribute(name3, "");
      else
        element.removeAttribute(name3);
    }
  }, numericAttribute = {
    get(element, name3) {
      return parseFloat(element.getAttribute(name3) || 0);
    },
    set(element, name3, value) {
      element.setAttribute(name3, value);
    }
  }, stringAttribute = {
    get(element, name3) {
      return element.getAttribute(name3) || "";
    },
    set(element, name3, value) {
      element.setAttribute(name3, value);
    }
  };
});
