// var: init_document_type
var init_document_type = __esm(() => {
  init_constants10();
  init_jsdon();
  init_node11();
  DocumentType = class DocumentType extends Node3 {
    constructor(ownerDocument, name3, publicId = "", systemId = "") {
      super(ownerDocument, "#document-type", DOCUMENT_TYPE_NODE);
      this.name = name3, this.publicId = publicId, this.systemId = systemId;
    }
    cloneNode() {
      let { ownerDocument, name: name3, publicId, systemId } = this;
      return new DocumentType(ownerDocument, name3, publicId, systemId);
    }
    toString() {
      let { name: name3, publicId, systemId } = this, hasPublic = 0 < publicId.length, str2 = [name3];
      if (hasPublic)
        str2.push("PUBLIC", `"${publicId}"`);
      if (systemId.length) {
        if (!hasPublic)
          str2.push("SYSTEM");
        str2.push(`"${systemId}"`);
      }
      return `<!DOCTYPE ${str2.join(" ")}>`;
    }
    toJSON() {
      let json2 = [];
      return documentTypeAsJSON(this, json2), json2;
    }
  };
});
