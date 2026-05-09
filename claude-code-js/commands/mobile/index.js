// Original: src/commands/mobile/index.ts
var mobile, mobile_default;
var init_mobile2 = __esm(() => {
  mobile = {
    type: "local-jsx",
    name: "mobile",
    aliases: ["ios", "android"],
    description: "Show QR code to download the Claude mobile app",
    load: () => Promise.resolve().then(() => (init_mobile(), exports_mobile))
  }, mobile_default = mobile;
});
