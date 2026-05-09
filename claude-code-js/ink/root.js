// Original: src/ink/root.ts
import { Stream as Stream3 } from "stream";
async function createRoot({
  stdout = process.stdout,
  stdin = process.stdin,
  stderr = process.stderr,
  exitOnCtrlC = !0,
  patchConsole = !0,
  onFrame
} = {}) {
  await Promise.resolve();
  let instance = new Ink({
    stdout,
    stdin,
    stderr,
    exitOnCtrlC,
    patchConsole,
    onFrame
  });
  return instances_default.set(stdout, instance), {
    render: (node) => instance.render(node),
    unmount: () => instance.unmount(),
    waitUntilExit: () => instance.waitUntilExit()
  };
}
var renderSync = (node, options) => {
  let opts = getOptions(options), inkOptions = {
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr,
    exitOnCtrlC: !0,
    patchConsole: !0,
    ...opts
  }, instance = getInstance(inkOptions.stdout, () => new Ink(inkOptions));
  return instance.render(node), {
    rerender: instance.render,
    unmount() {
      instance.unmount();
    },
    waitUntilExit: instance.waitUntilExit,
    cleanup: () => instances_default.delete(inkOptions.stdout)
  };
}, wrappedRender = async (node, options) => {
  await Promise.resolve();
  let instance = renderSync(node, options);
  return logForDebugging(`[render] first ink render: ${Math.round(process.uptime() * 1000)}ms since process start`), instance;
}, root_default, getOptions = (stdout = {}) => {
  if (stdout instanceof Stream3)
    return {
      stdout,
      stdin: process.stdin
    };
  return stdout;
}, getInstance = (stdout, createInstance2) => {
  let instance = instances_default.get(stdout);
  if (!instance)
    instance = createInstance2(), instances_default.set(stdout, instance);
  return instance;
};
var init_root = __esm(() => {
  init_debug();
  init_ink();
  init_instances();
  root_default = wrappedRender;
});
