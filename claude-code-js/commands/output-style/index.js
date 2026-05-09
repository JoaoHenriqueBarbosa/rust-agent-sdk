// Original: src/commands/output-style/index.ts
var outputStyle, output_style_default;
var init_output_style = __esm(() => {
  outputStyle = {
    type: "local-jsx",
    name: "output-style",
    description: "Deprecated: use /config to change output style",
    isHidden: !0,
    load: () => Promise.resolve().then(() => exports_output_style)
  }, output_style_default = outputStyle;
});
