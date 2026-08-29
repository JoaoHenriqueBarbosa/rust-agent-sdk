// Original: src/commands/heapdump/index.ts
var heapDump, heapdump_default;
var init_heapdump2 = __esm(() => {
  heapDump = {
    type: "local",
    name: "heapdump",
    description: "Dump the JS heap to ~/Desktop",
    isHidden: !0,
    supportsNonInteractive: !0,
    load: () => Promise.resolve().then(() => (init_heapdump(), exports_heapdump))
  }, heapdump_default = heapDump;
});
