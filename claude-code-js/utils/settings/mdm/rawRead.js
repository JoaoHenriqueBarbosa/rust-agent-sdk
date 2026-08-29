// Original: src/utils/settings/mdm/rawRead.ts
import { execFile } from "child_process";
import { existsSync as existsSync2 } from "fs";
function execFilePromise(cmd, args) {
  return new Promise((resolve7) => {
    execFile(cmd, args, { encoding: "utf-8", timeout: MDM_SUBPROCESS_TIMEOUT_MS }, (err, stdout) => {
      resolve7({ stdout: stdout ?? "", code: err ? 1 : 0 });
    });
  });
}
function fireRawRead() {
  return (async () => {
    if (process.platform === "darwin") {
      let plistPaths = getMacOSPlistPaths(), winner = (await Promise.all(plistPaths.map(async ({ path: path9, label }) => {
        if (!existsSync2(path9))
          return { stdout: "", label, ok: !1 };
        let { stdout, code } = await execFilePromise(PLUTIL_PATH, [
          ...PLUTIL_ARGS_PREFIX,
          path9
        ]);
        return { stdout, label, ok: code === 0 && !!stdout };
      }))).find((r) => r.ok);
      return {
        plistStdouts: winner ? [{ stdout: winner.stdout, label: winner.label }] : [],
        hklmStdout: null,
        hkcuStdout: null
      };
    }
    if (process.platform === "win32") {
      let [hklm, hkcu] = await Promise.all([
        execFilePromise("reg", [
          "query",
          WINDOWS_REGISTRY_KEY_PATH_HKLM,
          "/v",
          WINDOWS_REGISTRY_VALUE_NAME
        ]),
        execFilePromise("reg", [
          "query",
          WINDOWS_REGISTRY_KEY_PATH_HKCU,
          "/v",
          WINDOWS_REGISTRY_VALUE_NAME
        ])
      ]);
      return {
        plistStdouts: null,
        hklmStdout: hklm.code === 0 ? hklm.stdout : null,
        hkcuStdout: hkcu.code === 0 ? hkcu.stdout : null
      };
    }
    return { plistStdouts: null, hklmStdout: null, hkcuStdout: null };
  })();
}
function startMdmRawRead() {
  if (rawReadPromise)
    return;
  rawReadPromise = fireRawRead();
}
function getMdmRawReadPromise() {
  return rawReadPromise;
}
var rawReadPromise = null;
var init_rawRead = __esm(() => {
  init_constants4();
});
