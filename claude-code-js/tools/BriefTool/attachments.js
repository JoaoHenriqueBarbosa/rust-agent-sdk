// Original: src/tools/BriefTool/attachments.ts
import { stat as stat27 } from "fs/promises";
async function validateAttachmentPaths(rawPaths) {
  let cwd2 = getCwd();
  for (let rawPath of rawPaths) {
    let fullPath = expandPath(rawPath);
    try {
      if (!(await stat27(fullPath)).isFile())
        return {
          result: !1,
          message: `Attachment "${rawPath}" is not a regular file.`,
          errorCode: 1
        };
    } catch (e) {
      let code = getErrnoCode(e);
      if (code === "ENOENT")
        return {
          result: !1,
          message: `Attachment "${rawPath}" does not exist. Current working directory: ${cwd2}.`,
          errorCode: 1
        };
      if (code === "EACCES" || code === "EPERM")
        return {
          result: !1,
          message: `Attachment "${rawPath}" is not accessible (permission denied).`,
          errorCode: 1
        };
      throw e;
    }
  }
  return { result: !0 };
}
async function resolveAttachments(rawPaths, uploadCtx) {
  let stated = [];
  for (let rawPath of rawPaths) {
    let fullPath = expandPath(rawPath), stats = await stat27(fullPath);
    stated.push({
      path: fullPath,
      size: stats.size,
      isImage: IMAGE_EXTENSION_REGEX.test(fullPath)
    });
  }
  return stated;
}
var init_attachments = __esm(() => {
  init_cwd2();
  init_errors();
  init_imagePaste();
  init_path2();
});
