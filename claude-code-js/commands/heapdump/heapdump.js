// Original: src/commands/heapdump/heapdump.ts
var exports_heapdump = {};
__export(exports_heapdump, {
  call: () => call52
});
async function call52() {
  let result = await performHeapDump();
  if (!result.success)
    return {
      type: "text",
      value: `Failed to create heap dump: ${result.error}`
    };
  return {
    type: "text",
    value: `${result.heapPath}
${result.diagPath}`
  };
}
var init_heapdump = __esm(() => {
  init_heapDumpService();
});
