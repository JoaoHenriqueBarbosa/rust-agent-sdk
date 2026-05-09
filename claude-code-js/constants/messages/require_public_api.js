// var: require_public_api
var require_public_api = __commonJS((exports) => {
  var composer = require_composer(), Document = require_Document(), errors6 = require_errors6(), log3 = require_log(), identity16 = require_identity(), lineCounter = require_line_counter(), parser = require_parser();
  function parseOptions(options) {
    let prettyErrors = options.prettyErrors !== !1;
    return { lineCounter: options.lineCounter || prettyErrors && new lineCounter.LineCounter || null, prettyErrors };
  }
  function parseAllDocuments(source, options = {}) {
    let { lineCounter: lineCounter2, prettyErrors } = parseOptions(options), parser$1 = new parser.Parser(lineCounter2?.addNewLine), composer$1 = new composer.Composer(options), docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter2)
      for (let doc2 of docs)
        doc2.errors.forEach(errors6.prettifyError(source, lineCounter2)), doc2.warnings.forEach(errors6.prettifyError(source, lineCounter2));
    if (docs.length > 0)
      return docs;
    return Object.assign([], { empty: !0 }, composer$1.streamInfo());
  }
  function parseDocument(source, options = {}) {
    let { lineCounter: lineCounter2, prettyErrors } = parseOptions(options), parser$1 = new parser.Parser(lineCounter2?.addNewLine), composer$1 = new composer.Composer(options), doc2 = null;
    for (let _doc of composer$1.compose(parser$1.parse(source), !0, source.length))
      if (!doc2)
        doc2 = _doc;
      else if (doc2.options.logLevel !== "silent") {
        doc2.errors.push(new errors6.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    if (prettyErrors && lineCounter2)
      doc2.errors.forEach(errors6.prettifyError(source, lineCounter2)), doc2.warnings.forEach(errors6.prettifyError(source, lineCounter2));
    return doc2;
  }
  function parse10(src, reviver, options) {
    let _reviver = void 0;
    if (typeof reviver === "function")
      _reviver = reviver;
    else if (options === void 0 && reviver && typeof reviver === "object")
      options = reviver;
    let doc2 = parseDocument(src, options);
    if (!doc2)
      return null;
    if (doc2.warnings.forEach((warning) => log3.warn(doc2.options.logLevel, warning)), doc2.errors.length > 0)
      if (doc2.options.logLevel !== "silent")
        throw doc2.errors[0];
      else
        doc2.errors = [];
    return doc2.toJS(Object.assign({ reviver: _reviver }, options));
  }
  function stringify2(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer))
      _replacer = replacer;
    else if (options === void 0 && replacer)
      options = replacer;
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      let indent = Math.round(options);
      options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === void 0) {
      let { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return;
    }
    if (identity16.isDocument(value) && !_replacer)
      return value.toString(options);
    return new Document.Document(value, _replacer, options).toString(options);
  }
  exports.parse = parse10;
  exports.parseAllDocuments = parseAllDocuments;
  exports.parseDocument = parseDocument;
  exports.stringify = stringify2;
});
