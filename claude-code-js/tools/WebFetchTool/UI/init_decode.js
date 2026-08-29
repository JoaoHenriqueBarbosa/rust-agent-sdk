// var: init_decode
var init_decode = __esm(() => {
  init_decode_codepoint();
  init_bin_trie_flags();
  init_decode_codepoint();
  init_decode_data_html();
  init_decode_data_xml();
  (function(CharCodes2) {
    CharCodes2[CharCodes2.NUM = 35] = "NUM", CharCodes2[CharCodes2.SEMI = 59] = "SEMI", CharCodes2[CharCodes2.EQUALS = 61] = "EQUALS", CharCodes2[CharCodes2.ZERO = 48] = "ZERO", CharCodes2[CharCodes2.NINE = 57] = "NINE", CharCodes2[CharCodes2.LOWER_A = 97] = "LOWER_A", CharCodes2[CharCodes2.LOWER_F = 102] = "LOWER_F", CharCodes2[CharCodes2.LOWER_X = 120] = "LOWER_X", CharCodes2[CharCodes2.LOWER_Z = 122] = "LOWER_Z", CharCodes2[CharCodes2.UPPER_A = 65] = "UPPER_A", CharCodes2[CharCodes2.UPPER_F = 70] = "UPPER_F", CharCodes2[CharCodes2.UPPER_Z = 90] = "UPPER_Z";
  })(CharCodes || (CharCodes = {}));
  (function(EntityDecoderState2) {
    EntityDecoderState2[EntityDecoderState2.EntityStart = 0] = "EntityStart", EntityDecoderState2[EntityDecoderState2.NumericStart = 1] = "NumericStart", EntityDecoderState2[EntityDecoderState2.NumericDecimal = 2] = "NumericDecimal", EntityDecoderState2[EntityDecoderState2.NumericHex = 3] = "NumericHex", EntityDecoderState2[EntityDecoderState2.NamedEntity = 4] = "NamedEntity";
  })(EntityDecoderState || (EntityDecoderState = {}));
  (function(DecodingMode2) {
    DecodingMode2[DecodingMode2.Legacy = 0] = "Legacy", DecodingMode2[DecodingMode2.Strict = 1] = "Strict", DecodingMode2[DecodingMode2.Attribute = 2] = "Attribute";
  })(DecodingMode || (DecodingMode = {}));
});
