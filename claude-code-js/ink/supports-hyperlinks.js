// Original: src/ink/supports-hyperlinks.ts
function supportsHyperlinks(options) {
  if (options?.stdoutSupported ?? import_supports_hyperlinks.default.stdout)
    return !0;
  let env5 = options?.env ?? process.env, termProgram = env5.TERM_PROGRAM;
  if (termProgram && ADDITIONAL_HYPERLINK_TERMINALS.includes(termProgram))
    return !0;
  let lcTerminal = env5.LC_TERMINAL;
  if (lcTerminal && ADDITIONAL_HYPERLINK_TERMINALS.includes(lcTerminal))
    return !0;
  if (env5.TERM?.includes("kitty"))
    return !0;
  return !1;
}
var import_supports_hyperlinks, ADDITIONAL_HYPERLINK_TERMINALS;
var init_supports_hyperlinks = __esm(() => {
  import_supports_hyperlinks = __toESM(require_supports_hyperlinks(), 1), ADDITIONAL_HYPERLINK_TERMINALS = [
    "ghostty",
    "Hyper",
    "kitty",
    "alacritty",
    "iTerm.app",
    "iTerm2"
  ];
});
