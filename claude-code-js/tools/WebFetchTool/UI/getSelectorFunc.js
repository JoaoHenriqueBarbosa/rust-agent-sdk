// function: getSelectorFunc
function getSelectorFunc(searchFunc) {
  return function(query2, elements, options2) {
    let opts = convertOptionFormats(options2);
    if (typeof query2 !== "function")
      query2 = compileUnsafe(query2, opts, elements);
    let filteredElements = prepareContext(elements, opts.adapter, query2.shouldTestNextSiblings);
    return searchFunc(query2, filteredElements, opts);
  };
}
