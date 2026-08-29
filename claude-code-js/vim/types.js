// Original: src/vim/types.ts
function isOperatorKey(key3) {
  return key3 in OPERATORS;
}
function isTextObjScopeKey(key3) {
  return key3 in TEXT_OBJ_SCOPES;
}
function createInitialVimState() {
  return { mode: "INSERT", insertedText: "" };
}
function createInitialPersistentState() {
  return {
    lastChange: null,
    lastFind: null,
    register: "",
    registerIsLinewise: !1
  };
}
var OPERATORS, SIMPLE_MOTIONS, FIND_KEYS, TEXT_OBJ_SCOPES, TEXT_OBJ_TYPES, MAX_VIM_COUNT = 1e4;
var init_types24 = __esm(() => {
  OPERATORS = {
    d: "delete",
    c: "change",
    y: "yank"
  };
  SIMPLE_MOTIONS = /* @__PURE__ */ new Set([
    "h",
    "l",
    "j",
    "k",
    "w",
    "b",
    "e",
    "W",
    "B",
    "E",
    "0",
    "^",
    "$"
  ]), FIND_KEYS = /* @__PURE__ */ new Set(["f", "F", "t", "T"]), TEXT_OBJ_SCOPES = {
    i: "inner",
    a: "around"
  };
  TEXT_OBJ_TYPES = /* @__PURE__ */ new Set([
    "w",
    "W",
    '"',
    "'",
    "`",
    "(",
    ")",
    "b",
    "[",
    "]",
    "{",
    "}",
    "B",
    "<",
    ">"
  ]);
});
