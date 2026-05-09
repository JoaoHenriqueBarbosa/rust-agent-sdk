// Original: src/components/design-system/color.ts
function color(c3, theme, type = "foreground") {
  return (text) => {
    if (!c3)
      return text;
    if (c3.startsWith("rgb(") || c3.startsWith("#") || c3.startsWith("ansi256(") || c3.startsWith("ansi:"))
      return colorize(text, c3, type);
    return colorize(text, getTheme(theme)[c3], type);
  };
}
var init_color = __esm(() => {
  init_colorize();
  init_theme();
});
