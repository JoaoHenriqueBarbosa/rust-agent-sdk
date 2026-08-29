// Original: src/utils/imageStore.ts
import { mkdir as mkdir9, open as open6 } from "fs/promises";
import { join as join61 } from "path";
function getImageStoreDir() {
  return join61(getClaudeConfigHomeDir(), IMAGE_STORE_DIR, getSessionId());
}
async function ensureImageStoreDir() {
  let dir = getImageStoreDir();
  await mkdir9(dir, { recursive: !0 });
}
function getImagePath(imageId, mediaType) {
  let extension = mediaType.split("/")[1] || "png";
  return join61(getImageStoreDir(), `${imageId}.${extension}`);
}
function cacheImagePath(content) {
  if (content.type !== "image")
    return null;
  let imagePath = getImagePath(content.id, content.mediaType || "image/png");
  return evictOldestIfAtCap(), storedImagePaths.set(content.id, imagePath), imagePath;
}
async function storeImage(content) {
  if (content.type !== "image")
    return null;
  try {
    await ensureImageStoreDir();
    let imagePath = getImagePath(content.id, content.mediaType || "image/png"), fh = await open6(imagePath, "w", 384);
    try {
      await fh.writeFile(content.content, { encoding: "base64" }), await fh.datasync();
    } finally {
      await fh.close();
    }
    return evictOldestIfAtCap(), storedImagePaths.set(content.id, imagePath), logForDebugging(`Stored image ${content.id} to ${imagePath}`), imagePath;
  } catch (error44) {
    return logForDebugging(`Failed to store image: ${error44}`), null;
  }
}
async function storeImages(pastedContents) {
  let pathMap = /* @__PURE__ */ new Map;
  for (let [id, content] of Object.entries(pastedContents))
    if (content.type === "image") {
      let path16 = await storeImage(content);
      if (path16)
        pathMap.set(Number(id), path16);
    }
  return pathMap;
}
function getStoredImagePath(imageId) {
  return storedImagePaths.get(imageId) ?? null;
}
function clearStoredImagePaths() {
  storedImagePaths.clear();
}
function evictOldestIfAtCap() {
  while (storedImagePaths.size >= MAX_STORED_IMAGE_PATHS) {
    let oldest = storedImagePaths.keys().next().value;
    if (oldest !== void 0)
      storedImagePaths.delete(oldest);
    else
      break;
  }
}
async function cleanupOldImageCaches() {
  let fsImpl = getFsImplementation(), baseDir = join61(getClaudeConfigHomeDir(), IMAGE_STORE_DIR), currentSessionId = getSessionId();
  try {
    let sessionDirs;
    try {
      sessionDirs = await fsImpl.readdir(baseDir);
    } catch {
      return;
    }
    for (let sessionDir of sessionDirs) {
      if (sessionDir.name === currentSessionId)
        continue;
      let sessionPath = join61(baseDir, sessionDir.name);
      try {
        await fsImpl.rm(sessionPath, { recursive: !0, force: !0 }), logForDebugging(`Cleaned up old image cache: ${sessionPath}`);
      } catch {}
    }
    try {
      if ((await fsImpl.readdir(baseDir)).length === 0)
        await fsImpl.rmdir(baseDir);
    } catch {}
  } catch {}
}
var IMAGE_STORE_DIR = "image-cache", MAX_STORED_IMAGE_PATHS = 200, storedImagePaths;
var init_imageStore = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_fsOperations();
  storedImagePaths = /* @__PURE__ */ new Map;
});
