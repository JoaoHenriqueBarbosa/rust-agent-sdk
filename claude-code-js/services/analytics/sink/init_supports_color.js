// var: init_supports_color
var init_supports_color = __esm(() => {
  ({ env } = process3);
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never"))
    flagForceColor = 0;
  else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always"))
    flagForceColor = 1;
  supportsColor = {
    stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
    stderr: createSupportsColor({ isTTY: tty.isatty(2) })
  }, supports_color_default = supportsColor;
});
