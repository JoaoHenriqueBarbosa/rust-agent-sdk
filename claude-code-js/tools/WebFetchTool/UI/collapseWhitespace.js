// function: collapseWhitespace
function collapseWhitespace(options2) {
  var { element, isBlock: isBlock2, isVoid: isVoid3 } = options2, isPre = options2.isPre || function(node3) {
    return node3.nodeName === "PRE";
  };
  if (!element.firstChild || isPre(element))
    return;
  var prevText = null, keepLeadingWs = !1, prev = null, node2 = next(prev, element, isPre);
  while (node2 !== element) {
    if (node2.nodeType === 3 || node2.nodeType === 4) {
      var text2 = node2.data.replace(/[ \r\n\t]+/g, " ");
      if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text2[0] === " ")
        text2 = text2.substr(1);
      if (!text2) {
        node2 = remove3(node2);
        continue;
      }
      node2.data = text2, prevText = node2;
    } else if (node2.nodeType === 1) {
      if (isBlock2(node2) || node2.nodeName === "BR") {
        if (prevText)
          prevText.data = prevText.data.replace(/ $/, "");
        prevText = null, keepLeadingWs = !1;
      } else if (isVoid3(node2) || isPre(node2))
        prevText = null, keepLeadingWs = !0;
      else if (prevText)
        keepLeadingWs = !1;
    } else {
      node2 = remove3(node2);
      continue;
    }
    var nextNode = next(prev, node2, isPre);
    prev = node2, node2 = nextNode;
  }
  if (prevText) {
    if (prevText.data = prevText.data.replace(/ $/, ""), !prevText.data)
      remove3(prevText);
  }
}
