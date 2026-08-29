// var: init_Tokenizer
var init_Tokenizer = __esm(() => {
  init_decode();
  (function(CharCodes3) {
    CharCodes3[CharCodes3.Tab = 9] = "Tab", CharCodes3[CharCodes3.NewLine = 10] = "NewLine", CharCodes3[CharCodes3.FormFeed = 12] = "FormFeed", CharCodes3[CharCodes3.CarriageReturn = 13] = "CarriageReturn", CharCodes3[CharCodes3.Space = 32] = "Space", CharCodes3[CharCodes3.ExclamationMark = 33] = "ExclamationMark", CharCodes3[CharCodes3.Number = 35] = "Number", CharCodes3[CharCodes3.Amp = 38] = "Amp", CharCodes3[CharCodes3.SingleQuote = 39] = "SingleQuote", CharCodes3[CharCodes3.DoubleQuote = 34] = "DoubleQuote", CharCodes3[CharCodes3.Dash = 45] = "Dash", CharCodes3[CharCodes3.Slash = 47] = "Slash", CharCodes3[CharCodes3.Zero = 48] = "Zero", CharCodes3[CharCodes3.Nine = 57] = "Nine", CharCodes3[CharCodes3.Semi = 59] = "Semi", CharCodes3[CharCodes3.Lt = 60] = "Lt", CharCodes3[CharCodes3.Eq = 61] = "Eq", CharCodes3[CharCodes3.Gt = 62] = "Gt", CharCodes3[CharCodes3.Questionmark = 63] = "Questionmark", CharCodes3[CharCodes3.UpperA = 65] = "UpperA", CharCodes3[CharCodes3.LowerA = 97] = "LowerA", CharCodes3[CharCodes3.UpperF = 70] = "UpperF", CharCodes3[CharCodes3.LowerF = 102] = "LowerF", CharCodes3[CharCodes3.UpperZ = 90] = "UpperZ", CharCodes3[CharCodes3.LowerZ = 122] = "LowerZ", CharCodes3[CharCodes3.LowerX = 120] = "LowerX", CharCodes3[CharCodes3.OpeningSquareBracket = 91] = "OpeningSquareBracket";
  })(CharCodes2 || (CharCodes2 = {}));
  (function(State2) {
    State2[State2.Text = 1] = "Text", State2[State2.BeforeTagName = 2] = "BeforeTagName", State2[State2.InTagName = 3] = "InTagName", State2[State2.InSelfClosingTag = 4] = "InSelfClosingTag", State2[State2.BeforeClosingTagName = 5] = "BeforeClosingTagName", State2[State2.InClosingTagName = 6] = "InClosingTagName", State2[State2.AfterClosingTagName = 7] = "AfterClosingTagName", State2[State2.BeforeAttributeName = 8] = "BeforeAttributeName", State2[State2.InAttributeName = 9] = "InAttributeName", State2[State2.AfterAttributeName = 10] = "AfterAttributeName", State2[State2.BeforeAttributeValue = 11] = "BeforeAttributeValue", State2[State2.InAttributeValueDq = 12] = "InAttributeValueDq", State2[State2.InAttributeValueSq = 13] = "InAttributeValueSq", State2[State2.InAttributeValueNq = 14] = "InAttributeValueNq", State2[State2.BeforeDeclaration = 15] = "BeforeDeclaration", State2[State2.InDeclaration = 16] = "InDeclaration", State2[State2.InProcessingInstruction = 17] = "InProcessingInstruction", State2[State2.BeforeComment = 18] = "BeforeComment", State2[State2.CDATASequence = 19] = "CDATASequence", State2[State2.InSpecialComment = 20] = "InSpecialComment", State2[State2.InCommentLike = 21] = "InCommentLike", State2[State2.BeforeSpecialS = 22] = "BeforeSpecialS", State2[State2.BeforeSpecialT = 23] = "BeforeSpecialT", State2[State2.SpecialStartSequence = 24] = "SpecialStartSequence", State2[State2.InSpecialTag = 25] = "InSpecialTag", State2[State2.InEntity = 26] = "InEntity";
  })(State || (State = {}));
  (function(QuoteType2) {
    QuoteType2[QuoteType2.NoValue = 0] = "NoValue", QuoteType2[QuoteType2.Unquoted = 1] = "Unquoted", QuoteType2[QuoteType2.Single = 2] = "Single", QuoteType2[QuoteType2.Double = 3] = "Double";
  })(QuoteType || (QuoteType = {}));
  Sequences = {
    Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
    CdataEnd: new Uint8Array([93, 93, 62]),
    CommentEnd: new Uint8Array([45, 45, 62]),
    ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
    StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
    TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
    TextareaEnd: new Uint8Array([
      60,
      47,
      116,
      101,
      120,
      116,
      97,
      114,
      101,
      97
    ]),
    XmpEnd: new Uint8Array([60, 47, 120, 109, 112])
  };
});
