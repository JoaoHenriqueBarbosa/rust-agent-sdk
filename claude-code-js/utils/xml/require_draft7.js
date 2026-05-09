// var: require_draft7
var require_draft7 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var core_1 = require_core3(), validation_1 = require_validation(), applicator_1 = require_applicator(), format_1 = require_format2(), metadata_1 = require_metadata(), draft7Vocabularies = [
    core_1.default,
    validation_1.default,
    (0, applicator_1.default)(),
    format_1.default,
    metadata_1.metadataVocabulary,
    metadata_1.contentVocabulary
  ];
  exports.default = draft7Vocabularies;
});
