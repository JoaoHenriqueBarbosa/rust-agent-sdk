// Original: src/commands/stickers/stickers.ts
var exports_stickers = {};
__export(exports_stickers, {
  call: () => call56
});
async function call56() {
  if (await openBrowser("https://www.stickermule.com/claudecode"))
    return { type: "text", value: "Opening sticker page in browser\u2026" };
  else
    return {
      type: "text",
      value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
    };
}
var init_stickers = __esm(() => {
  init_browser();
});
