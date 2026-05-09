// Original: src/commands/extra-usage/extra-usage-noninteractive.ts
var exports_extra_usage_noninteractive = {};
__export(exports_extra_usage_noninteractive, {
  call: () => call4
});
async function call4() {
  let result = await runExtraUsage();
  if (result.type === "message")
    return { type: "text", value: result.value };
  return {
    type: "text",
    value: result.opened ? `Browser opened to manage extra usage. If it didn't open, visit: ${result.url}` : `Please visit ${result.url} to manage extra usage.`
  };
}
var init_extra_usage_noninteractive = __esm(() => {
  init_extra_usage_core();
});
