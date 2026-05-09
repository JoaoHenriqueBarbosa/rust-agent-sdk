// Original: src/commands/theme/index.ts
var theme, theme_default;
var init_theme4 = __esm(() => {
  theme = {
    type: "local-jsx",
    name: "theme",
    description: "Change the theme",
    load: () => Promise.resolve().then(() => (init_theme3(), exports_theme))
  }, theme_default = theme;
});
