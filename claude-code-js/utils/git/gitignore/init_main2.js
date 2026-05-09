// var: init_main2
var init_main2 = __esm(() => {
  init_format2();
  init_edit();
  init_scanner();
  init_parser2();
  (function(ScanError2) {
    ScanError2[ScanError2.None = 0] = "None", ScanError2[ScanError2.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", ScanError2[ScanError2.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", ScanError2[ScanError2.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", ScanError2[ScanError2.InvalidUnicode = 4] = "InvalidUnicode", ScanError2[ScanError2.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", ScanError2[ScanError2.InvalidCharacter = 6] = "InvalidCharacter";
  })(ScanError || (ScanError = {}));
  (function(SyntaxKind2) {
    SyntaxKind2[SyntaxKind2.OpenBraceToken = 1] = "OpenBraceToken", SyntaxKind2[SyntaxKind2.CloseBraceToken = 2] = "CloseBraceToken", SyntaxKind2[SyntaxKind2.OpenBracketToken = 3] = "OpenBracketToken", SyntaxKind2[SyntaxKind2.CloseBracketToken = 4] = "CloseBracketToken", SyntaxKind2[SyntaxKind2.CommaToken = 5] = "CommaToken", SyntaxKind2[SyntaxKind2.ColonToken = 6] = "ColonToken", SyntaxKind2[SyntaxKind2.NullKeyword = 7] = "NullKeyword", SyntaxKind2[SyntaxKind2.TrueKeyword = 8] = "TrueKeyword", SyntaxKind2[SyntaxKind2.FalseKeyword = 9] = "FalseKeyword", SyntaxKind2[SyntaxKind2.StringLiteral = 10] = "StringLiteral", SyntaxKind2[SyntaxKind2.NumericLiteral = 11] = "NumericLiteral", SyntaxKind2[SyntaxKind2.LineCommentTrivia = 12] = "LineCommentTrivia", SyntaxKind2[SyntaxKind2.BlockCommentTrivia = 13] = "BlockCommentTrivia", SyntaxKind2[SyntaxKind2.LineBreakTrivia = 14] = "LineBreakTrivia", SyntaxKind2[SyntaxKind2.Trivia = 15] = "Trivia", SyntaxKind2[SyntaxKind2.Unknown = 16] = "Unknown", SyntaxKind2[SyntaxKind2.EOF = 17] = "EOF";
  })(SyntaxKind || (SyntaxKind = {}));
  parse6 = parse5;
  (function(ParseErrorCode2) {
    ParseErrorCode2[ParseErrorCode2.InvalidSymbol = 1] = "InvalidSymbol", ParseErrorCode2[ParseErrorCode2.InvalidNumberFormat = 2] = "InvalidNumberFormat", ParseErrorCode2[ParseErrorCode2.PropertyNameExpected = 3] = "PropertyNameExpected", ParseErrorCode2[ParseErrorCode2.ValueExpected = 4] = "ValueExpected", ParseErrorCode2[ParseErrorCode2.ColonExpected = 5] = "ColonExpected", ParseErrorCode2[ParseErrorCode2.CommaExpected = 6] = "CommaExpected", ParseErrorCode2[ParseErrorCode2.CloseBraceExpected = 7] = "CloseBraceExpected", ParseErrorCode2[ParseErrorCode2.CloseBracketExpected = 8] = "CloseBracketExpected", ParseErrorCode2[ParseErrorCode2.EndOfFileExpected = 9] = "EndOfFileExpected", ParseErrorCode2[ParseErrorCode2.InvalidCommentToken = 10] = "InvalidCommentToken", ParseErrorCode2[ParseErrorCode2.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", ParseErrorCode2[ParseErrorCode2.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", ParseErrorCode2[ParseErrorCode2.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", ParseErrorCode2[ParseErrorCode2.InvalidUnicode = 14] = "InvalidUnicode", ParseErrorCode2[ParseErrorCode2.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", ParseErrorCode2[ParseErrorCode2.InvalidCharacter = 16] = "InvalidCharacter";
  })(ParseErrorCode || (ParseErrorCode = {}));
});
