// class: DOMParser
class DOMParser {
  parseFromString(markupLanguage, mimeType, globals = null) {
    let isHTML = !1, document2;
    if (mimeType === "text/html")
      isHTML = !0, document2 = new HTMLDocument;
    else if (mimeType === "image/svg+xml")
      document2 = new SVGDocument;
    else
      document2 = new XMLDocument;
    if (document2[DOM_PARSER] = DOMParser, globals)
      document2[GLOBALS] = globals;
    if (isHTML && markupLanguage === "...")
      markupLanguage = "<!doctype html><html><head></head><body></body></html>";
    return markupLanguage ? parseFromString(document2, isHTML, markupLanguage) : document2;
  }
}
