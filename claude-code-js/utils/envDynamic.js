// Original: src/utils/envDynamic.ts
import { stat as stat14 } from "fs/promises";
function getIsBubblewrapSandbox() {
  return process.platform === "linux" && isEnvTruthy(process.env.CLAUDE_CODE_BUBBLEWRAP);
}
function isMuslEnvironment() {
  if (process.platform !== "linux")
    return !1;
  return muslRuntimeCache ?? !1;
}
async function detectJetBrainsIDEFromParentProcessAsync() {
  if (jetBrainsIDECache !== void 0)
    return jetBrainsIDECache;
  if (process.platform === "darwin")
    return jetBrainsIDECache = null, null;
  try {
    let commands7 = await getAncestorCommandsAsync(process.pid, 10);
    for (let command12 of commands7) {
      let lowerCommand = command12.toLowerCase();
      for (let ide of JETBRAINS_IDES)
        if (lowerCommand.includes(ide))
          return jetBrainsIDECache = ide, ide;
    }
  } catch {}
  return jetBrainsIDECache = null, null;
}
async function getTerminalWithJetBrainsDetectionAsync() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (env3.platform !== "darwin")
      return await detectJetBrainsIDEFromParentProcessAsync() || "pycharm";
  }
  return env3.terminal;
}
function getTerminalWithJetBrainsDetection() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (env3.platform !== "darwin") {
      if (jetBrainsIDECache !== void 0)
        return jetBrainsIDECache || "pycharm";
      return "pycharm";
    }
  }
  return env3.terminal;
}
async function initJetBrainsDetection() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm")
    await detectJetBrainsIDEFromParentProcessAsync();
}
var getIsDocker, muslRuntimeCache = null, jetBrainsIDECache, envDynamic;
var init_envDynamic = __esm(() => {
  init_memoize();
  init_env();
  init_envUtils();
  init_execFileNoThrow();
  init_genericProcessUtils();
  getIsDocker = memoize_default(async () => {
    if (process.platform !== "linux")
      return !1;
    let { code } = await execFileNoThrow("test", ["-f", "/.dockerenv"]);
    return code === 0;
  });
  if (process.platform === "linux") {
    let muslArch = process.arch === "x64" ? "x86_64" : "aarch64";
    stat14(`/lib/libc.musl-${muslArch}.so.1`).then(() => {
      muslRuntimeCache = !0;
    }, () => {
      muslRuntimeCache = !1;
    });
  }
  envDynamic = {
    ...env3,
    terminal: getTerminalWithJetBrainsDetection(),
    getIsDocker,
    getIsBubblewrapSandbox,
    isMuslEnvironment,
    getTerminalWithJetBrainsDetectionAsync,
    initJetBrainsDetection
  };
});
