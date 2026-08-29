// Original: src/commands/color/index.ts
var color2, color_default;
var init_color3 = __esm(() => {
  color2 = {
    type: "local-jsx",
    name: "color",
    description: "Set the prompt bar color for this session",
    immediate: !0,
    argumentHint: "<color|default>",
    load: () => Promise.resolve().then(() => (init_color2(), exports_color))
  }, color_default = color2;
});
