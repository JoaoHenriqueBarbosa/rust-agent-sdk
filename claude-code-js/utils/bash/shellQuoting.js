// Original: src/utils/bash/shellQuoting.ts
function containsHeredoc(command12) {
  if (/\d\s*<<\s*\d/.test(command12) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(command12) || /\$\(\(.*<<.*\)\)/.test(command12))
    return !1;
  return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(command12);
}
function containsMultilineString(command12) {
  let singleQuoteMultiline = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/, doubleQuoteMultiline = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
  return singleQuoteMultiline.test(command12) || doubleQuoteMultiline.test(command12);
}
function quoteShellCommand(command12, addStdinRedirect = !0) {
  if (containsHeredoc(command12) || containsMultilineString(command12)) {
    let quoted = `'${command12.replace(/'/g, `'"'"'`)}'`;
    if (containsHeredoc(command12))
      return quoted;
    return addStdinRedirect ? `${quoted} < /dev/null` : quoted;
  }
  if (addStdinRedirect)
    return quote([command12, "<", "/dev/null"]);
  return quote([command12]);
}
function hasStdinRedirect(command12) {
  return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(command12);
}
function shouldAddStdinRedirect(command12) {
  if (containsHeredoc(command12))
    return !1;
  if (hasStdinRedirect(command12))
    return !1;
  return !0;
}
function rewriteWindowsNullRedirect(command12) {
  return command12.replace(NUL_REDIRECT_REGEX, "$1/dev/null");
}
var NUL_REDIRECT_REGEX;
var init_shellQuoting = __esm(() => {
  init_shellQuote();
  NUL_REDIRECT_REGEX = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g;
});
