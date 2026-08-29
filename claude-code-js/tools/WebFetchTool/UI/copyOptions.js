// function: copyOptions
function copyOptions(options2) {
  return {
    xmlMode: !!options2.xmlMode,
    lowerCaseAttributeNames: !!options2.lowerCaseAttributeNames,
    lowerCaseTags: !!options2.lowerCaseTags,
    quirksMode: !!options2.quirksMode,
    cacheResults: !!options2.cacheResults,
    pseudos: options2.pseudos,
    adapter: options2.adapter,
    equals: options2.equals
  };
}
