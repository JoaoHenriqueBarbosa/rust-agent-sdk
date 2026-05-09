// Original: src/utils/tempfile.ts
import { createHash as createHash16, randomUUID as randomUUID12 } from "crypto";
import { tmpdir as tmpdir6 } from "os";
import { join as join78 } from "path";
function generateTempFilePath(prefix = "claude-prompt", extension = ".md", options2) {
  let id = options2?.contentHash ? createHash16("sha256").update(options2.contentHash).digest("hex").slice(0, 16) : randomUUID12();
  return join78(tmpdir6(), `${prefix}-${id}${extension}`);
}
var init_tempfile = () => {};
