// var: init_esm33
var init_esm33 = __esm(() => {
  init_esm30();
  init_compile2();
  init_subselects();
  init_pseudo_selectors();
  import_boolbase6 = __toESM(require_boolbase(), 1), defaultOptions2 = {
    adapter: exports_esm7,
    equals: defaultEquals
  };
  compile3 = wrapCompile(compile2), _compileUnsafe = wrapCompile(compileUnsafe), _compileToken = wrapCompile(compileToken);
  selectAll = getSelectorFunc((query2, elems, options2) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? [] : options2.adapter.findAll(query2, elems)), selectOne = getSelectorFunc((query2, elems, options2) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? null : options2.adapter.findOne(query2, elems));
});
