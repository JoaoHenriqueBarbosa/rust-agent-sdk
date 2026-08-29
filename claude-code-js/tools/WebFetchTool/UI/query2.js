// var: query2
var query2 = (method, ownerDocument, selectors) => {
  let { [NEXT]: next, [END]: end } = ownerDocument;
  return method.call({ ownerDocument, [NEXT]: next, [END]: end }, selectors);
}, globalExports, window2, Document2;
