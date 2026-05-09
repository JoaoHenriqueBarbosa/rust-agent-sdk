// Original: src/utils/bash/shellPrefix.ts
function formatShellPrefixCommand(prefix, command12) {
  let spaceBeforeDash = prefix.lastIndexOf(" -");
  if (spaceBeforeDash > 0) {
    let execPath2 = prefix.substring(0, spaceBeforeDash), args = prefix.substring(spaceBeforeDash + 1);
    return `${quote([execPath2])} ${args} ${quote([command12])}`;
  } else
    return `${quote([prefix])} ${quote([command12])}`;
}
var init_shellPrefix = __esm(() => {
  init_shellQuote();
});
