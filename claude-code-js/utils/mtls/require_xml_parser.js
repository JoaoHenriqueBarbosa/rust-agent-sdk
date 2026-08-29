// var: require_xml_parser
var require_xml_parser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.parseXML = parseXML;
  var fast_xml_parser_1 = require_fxp(), parser = new fast_xml_parser_1.XMLParser({
    attributeNamePrefix: "",
    processEntities: {
      enabled: !0,
      maxTotalExpansions: 1 / 0
    },
    htmlEntities: !0,
    ignoreAttributes: !1,
    ignoreDeclaration: !0,
    parseTagValue: !1,
    trimValues: !1,
    tagValueProcessor: (_, val) => val.trim() === "" && val.includes(`
`) ? "" : void 0,
    maxNestedTags: 1 / 0
  });
  parser.addEntity("#xD", "\r");
  parser.addEntity("#10", `
`);
  function parseXML(xmlString) {
    return parser.parse(xmlString, !0);
  }
});
