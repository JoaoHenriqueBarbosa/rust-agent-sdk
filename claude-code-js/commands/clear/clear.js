// Original: src/commands/clear/clear.ts
var exports_clear = {};
__export(exports_clear, {
  call: () => call9
});
var call9 = async (_, context6) => {
  return await clearConversation(context6), { type: "text", value: "" };
};
var init_clear = __esm(() => {
  init_conversation();
});
