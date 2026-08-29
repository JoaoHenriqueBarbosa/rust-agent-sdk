// Original: src/utils/secureStorage/plainTextStorage.ts
import { chmodSync as chmodSync2 } from "fs";
import { join as join22 } from "path";
function getStoragePath() {
  let storageDir = getClaudeConfigHomeDir(), storageFileName = ".credentials.json";
  return { storageDir, storagePath: join22(storageDir, ".credentials.json") };
}
var plainTextStorage;
var init_plainTextStorage = __esm(() => {
  init_envUtils();
  init_errors();
  init_fsOperations();
  init_slowOperations();
  plainTextStorage = {
    name: "plaintext",
    read() {
      let { storagePath } = getStoragePath();
      try {
        let data = getFsImplementation().readFileSync(storagePath, {
          encoding: "utf8"
        });
        return jsonParse(data);
      } catch {
        return null;
      }
    },
    async readAsync() {
      let { storagePath } = getStoragePath();
      try {
        let data = await getFsImplementation().readFile(storagePath, {
          encoding: "utf8"
        });
        return jsonParse(data);
      } catch {
        return null;
      }
    },
    update(data) {
      try {
        let { storageDir, storagePath } = getStoragePath();
        try {
          getFsImplementation().mkdirSync(storageDir);
        } catch (e) {
          if (getErrnoCode(e) !== "EEXIST")
            throw e;
        }
        return writeFileSync_DEPRECATED(storagePath, jsonStringify(data), {
          encoding: "utf8",
          flush: !1
        }), chmodSync2(storagePath, 384), {
          success: !0,
          warning: "Warning: Storing credentials in plaintext."
        };
      } catch {
        return { success: !1 };
      }
    },
    delete() {
      let { storagePath } = getStoragePath();
      try {
        return getFsImplementation().unlinkSync(storagePath), !0;
      } catch (e) {
        if (getErrnoCode(e) === "ENOENT")
          return !0;
        return !1;
      }
    }
  };
});
