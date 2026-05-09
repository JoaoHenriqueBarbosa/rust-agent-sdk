// Original: src/utils/renderOptions.ts
import { openSync as openSync4 } from "fs";
import { ReadStream } from "tty";
function getStdinOverride() {
  if (cachedStdinOverride !== null)
    return cachedStdinOverride;
  if (process.stdin.isTTY) {
    cachedStdinOverride = void 0;
    return;
  }
  if (isEnvTruthy(process.env.CI)) {
    cachedStdinOverride = void 0;
    return;
  }
  if (process.argv.includes("mcp")) {
    cachedStdinOverride = void 0;
    return;
  }
  if (process.platform === "win32") {
    cachedStdinOverride = void 0;
    return;
  }
  try {
    let ttyFd = openSync4("/dev/tty", "r"), ttyStream = new ReadStream(ttyFd);
    return ttyStream.isTTY = !0, cachedStdinOverride = ttyStream, cachedStdinOverride;
  } catch (err2) {
    logError2(err2), cachedStdinOverride = void 0;
    return;
  }
}
function getBaseRenderOptions(exitOnCtrlC = !1) {
  let stdin = getStdinOverride(), options2 = { exitOnCtrlC };
  if (stdin)
    options2.stdin = stdin;
  return options2;
}
var cachedStdinOverride = null;
var init_renderOptions = __esm(() => {
  init_envUtils();
  init_log3();
});
