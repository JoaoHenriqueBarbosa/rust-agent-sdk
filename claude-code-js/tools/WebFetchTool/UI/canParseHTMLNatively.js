// function: canParseHTMLNatively
function canParseHTMLNatively() {
  var Parser4 = root2.DOMParser, canParse = !1;
  try {
    if (new Parser4().parseFromString("", "text/html"))
      canParse = !0;
  } catch (e) {}
  return canParse;
}
