// function: RootNode
function RootNode(input, options2) {
  var root3;
  if (typeof input === "string") {
    var doc2 = htmlParser().parseFromString('<x-turndown id="turndown-root">' + input + "</x-turndown>", "text/html");
    root3 = doc2.getElementById("turndown-root");
  } else
    root3 = input.cloneNode(!0);
  return collapseWhitespace({
    element: root3,
    isBlock,
    isVoid: isVoid2,
    isPre: options2.preformattedCode ? isPreOrCode : null
  }), root3;
}
