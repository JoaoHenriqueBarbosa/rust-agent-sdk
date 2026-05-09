// var: init_compile2
var init_compile2 = __esm(() => {
  init_es3();
  init_sort();
  init_general();
  init_subselects();
  import_boolbase5 = __toESM(require_boolbase(), 1);
  DESCENDANT_TOKEN = { type: SelectorType.Descendant }, FLEXIBLE_DESCENDANT_TOKEN = {
    type: "_flexibleDescendant"
  }, SCOPE_TOKEN = {
    type: SelectorType.Pseudo,
    name: "scope",
    data: null
  };
});
