// function: getBaseURL
function getBaseURL() {
  let doc2 = "document" in globalThis ? globalThis.document : void 0;
  return doc2 && typeof doc2 == "object" && "baseURI" in doc2 && typeof doc2.baseURI == "string" ? doc2.baseURI : void 0;
}
