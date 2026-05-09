// Original: src/utils/hyperlink.ts
function createHyperlink(url3, content, options2) {
  if (!(options2?.supportsHyperlinks ?? supportsHyperlinks()))
    return url3;
  let displayText = content ?? url3, coloredText = source_default.blue(displayText);
  return `${OSC8_START}${url3}${OSC8_END}${coloredText}${OSC8_START}${OSC8_END}`;
}
var OSC8_START = "\x1B]8;;", OSC8_END = "\x07";
var init_hyperlink = __esm(() => {
  init_source();
  init_supports_hyperlinks();
});
