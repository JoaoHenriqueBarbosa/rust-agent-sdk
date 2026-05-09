// Original: src/utils/bash/parser.ts
var exports_parser2 = {};
__export(exports_parser2, {
  parseCommandRaw: () => parseCommandRaw,
  parseCommand: () => parseCommand3,
  extractCommandArguments: () => extractCommandArguments,
  ensureInitialized: () => ensureInitialized,
  PARSE_ABORTED: () => PARSE_ABORTED
});
function logLoadOnce(success2) {
  if (logged)
    return;
  logged = !0, logForDebugging(success2 ? "tree-sitter: native module loaded" : "tree-sitter: unavailable"), logEvent("tengu_tree_sitter_load", { success: success2 });
}
async function ensureInitialized() {
  await ensureParserInitialized();
}
async function parseCommand3(command12) {
  if (!command12 || command12.length > MAX_COMMAND_LENGTH)
    return null;
  return null;
}
async function parseCommandRaw(command12) {
  if (!command12 || command12.length > MAX_COMMAND_LENGTH)
    return null;
  {
    await ensureParserInitialized();
    let mod = getParserModule();
    if (logLoadOnce(mod !== null), !mod)
      return null;
    try {
      let result = mod.parse(command12);
      if (result === null)
        return logEvent("tengu_tree_sitter_parse_abort", {
          cmdLength: command12.length,
          panic: !1
        }), PARSE_ABORTED;
      return result;
    } catch {
      return logEvent("tengu_tree_sitter_parse_abort", {
        cmdLength: command12.length,
        panic: !0
      }), PARSE_ABORTED;
    }
  }
  return null;
}
function extractCommandArguments(commandNode) {
  if (commandNode.type === "declaration_command") {
    let firstChild = commandNode.children[0];
    return firstChild && DECLARATION_COMMANDS.has(firstChild.text) ? [firstChild.text] : [];
  }
  let args = [], foundCommandName = !1;
  for (let child of commandNode.children) {
    if (child.type === "variable_assignment")
      continue;
    if (child.type === "command_name" || !foundCommandName && child.type === "word") {
      foundCommandName = !0, args.push(child.text);
      continue;
    }
    if (ARGUMENT_TYPES.has(child.type))
      args.push(stripQuotes(child.text));
    else if (SUBSTITUTION_TYPES.has(child.type))
      break;
  }
  return args;
}
function stripQuotes(text2) {
  return text2.length >= 2 && (text2[0] === '"' && text2.at(-1) === '"' || text2[0] === "'" && text2.at(-1) === "'") ? text2.slice(1, -1) : text2;
}
var MAX_COMMAND_LENGTH = 1e4, DECLARATION_COMMANDS, ARGUMENT_TYPES, SUBSTITUTION_TYPES, logged = !1, PARSE_ABORTED;
var init_parser4 = __esm(() => {
  init_debug();
  init_bashParser();
  DECLARATION_COMMANDS = /* @__PURE__ */ new Set([
    "export",
    "declare",
    "typeset",
    "readonly",
    "local",
    "unset",
    "unsetenv"
  ]), ARGUMENT_TYPES = /* @__PURE__ */ new Set(["word", "string", "raw_string", "number"]), SUBSTITUTION_TYPES = /* @__PURE__ */ new Set([
    "command_substitution",
    "process_substitution"
  ]);
  PARSE_ABORTED = Symbol("parse-aborted");
});
