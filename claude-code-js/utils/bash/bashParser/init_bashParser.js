// var: init_bashParser
var init_bashParser = __esm(() => {
  MODULE = { parse: parseSource }, READY = Promise.resolve();
  SPECIAL_VARS = /* @__PURE__ */ new Set(["?", "$", "@", "*", "#", "-", "!", "_"]), DECL_KEYWORDS = /* @__PURE__ */ new Set([
    "export",
    "declare",
    "typeset",
    "readonly",
    "local"
  ]), SHELL_KEYWORDS = /* @__PURE__ */ new Set([
    "if",
    "then",
    "elif",
    "else",
    "fi",
    "while",
    "until",
    "for",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "function",
    "select"
  ]);
  ARITH_PREC = {
    "=": 2,
    "+=": 2,
    "-=": 2,
    "*=": 2,
    "/=": 2,
    "%=": 2,
    "<<=": 2,
    ">>=": 2,
    "&=": 2,
    "^=": 2,
    "|=": 2,
    "||": 4,
    "&&": 5,
    "|": 6,
    "^": 7,
    "&": 8,
    "==": 9,
    "!=": 9,
    "<": 10,
    ">": 10,
    "<=": 10,
    ">=": 10,
    "<<": 11,
    ">>": 11,
    "+": 12,
    "-": 12,
    "*": 13,
    "/": 13,
    "%": 13,
    "**": 14
  }, ARITH_RIGHT_ASSOC = /* @__PURE__ */ new Set([
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    "&=",
    "^=",
    "|=",
    "**"
  ]);
});
