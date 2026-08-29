// Original: src/utils/imagePaste.ts
import { randomBytes as randomBytes8 } from "crypto";
import { basename as basename13, extname as extname6, isAbsolute as isAbsolute13, join as join60 } from "path";
function getClipboardCommands() {
  let platform5 = process.platform, baseTmpDir = process.env.CLAUDE_CODE_TMPDIR || (platform5 === "win32" ? process.env.TEMP || "C:\\Temp" : "/tmp"), screenshotFilename = "claude_cli_latest_screenshot.png", tempPaths = {
    darwin: join60(baseTmpDir, "claude_cli_latest_screenshot.png"),
    linux: join60(baseTmpDir, "claude_cli_latest_screenshot.png"),
    win32: join60(baseTmpDir, "claude_cli_latest_screenshot.png")
  }, screenshotPath = tempPaths[platform5] || tempPaths.linux, commands7 = {
    darwin: {
      checkImage: "osascript -e 'the clipboard as \xABclass PNGf\xBB'",
      saveImage: `osascript -e 'set png_data to (the clipboard as \xABclass PNGf\xBB)' -e 'set fp to open for access POSIX file "${screenshotPath}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
      getPath: "osascript -e 'get POSIX path of (the clipboard as \xABclass furl\xBB)'",
      deleteFile: `rm -f "${screenshotPath}"`
    },
    linux: {
      checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)"',
      saveImage: `xclip -selection clipboard -t image/png -o > "${screenshotPath}" 2>/dev/null || wl-paste --type image/png > "${screenshotPath}" 2>/dev/null || xclip -selection clipboard -t image/bmp -o > "${screenshotPath}" 2>/dev/null || wl-paste --type image/bmp > "${screenshotPath}"`,
      getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
      deleteFile: `rm -f "${screenshotPath}"`
    },
    win32: {
      checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
      saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${screenshotPath.replace(/\\/g, "\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
      getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
      deleteFile: `del /f "${screenshotPath}"`
    }
  };
  return {
    commands: commands7[platform5] || commands7.linux,
    screenshotPath
  };
}
async function hasImageInClipboard() {
  if (process.platform !== "darwin")
    return !1;
  return (await execFileNoThrowWithCwd("osascript", [
    "-e",
    "the clipboard as \xABclass PNGf\xBB"
  ])).code === 0;
}
async function getImageFromClipboard() {
  let { commands: commands7, screenshotPath } = getClipboardCommands();
  try {
    if ((await execa(commands7.checkImage, {
      shell: !0,
      reject: !1
    })).exitCode !== 0)
      return null;
    if ((await execa(commands7.saveImage, {
      shell: !0,
      reject: !1
    })).exitCode !== 0)
      return null;
    let imageBuffer = getFsImplementation().readFileBytesSync(screenshotPath);
    if (imageBuffer.length >= 2 && imageBuffer[0] === 66 && imageBuffer[1] === 77)
      imageBuffer = await (await getImageProcessor())(imageBuffer).png().toBuffer();
    let resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, imageBuffer.length, "png"), base64Image = resized.buffer.toString("base64"), mediaType = detectImageFormatFromBase64(base64Image);
    return execa(commands7.deleteFile, { shell: !0, reject: !1 }), {
      base64: base64Image,
      mediaType,
      dimensions: resized.dimensions
    };
  } catch {
    return null;
  }
}
async function getImagePathFromClipboard() {
  let { commands: commands7 } = getClipboardCommands();
  try {
    let result = await execa(commands7.getPath, {
      shell: !0,
      reject: !1
    });
    if (result.exitCode !== 0 || !result.stdout)
      return null;
    return result.stdout.trim();
  } catch (e) {
    return logError2(e), null;
  }
}
function removeOuterQuotes(text2) {
  if (text2.startsWith('"') && text2.endsWith('"') || text2.startsWith("'") && text2.endsWith("'"))
    return text2.slice(1, -1);
  return text2;
}
function stripBackslashEscapes(path16) {
  if (process.platform === "win32")
    return path16;
  let placeholder = `__DOUBLE_BACKSLASH_${randomBytes8(8).toString("hex")}__`;
  return path16.replace(/\\\\/g, placeholder).replace(/\\(.)/g, "$1").replace(new RegExp(placeholder, "g"), "\\");
}
function isImageFilePath(text2) {
  let cleaned = removeOuterQuotes(text2.trim()), unescaped = stripBackslashEscapes(cleaned);
  return IMAGE_EXTENSION_REGEX.test(unescaped);
}
function asImageFilePath(text2) {
  let cleaned = removeOuterQuotes(text2.trim()), unescaped = stripBackslashEscapes(cleaned);
  if (IMAGE_EXTENSION_REGEX.test(unescaped))
    return unescaped;
  return null;
}
async function tryReadImageFromPath(text2) {
  let cleanedPath = asImageFilePath(text2);
  if (!cleanedPath)
    return null;
  let imagePath = cleanedPath, imageBuffer;
  try {
    if (isAbsolute13(imagePath))
      imageBuffer = getFsImplementation().readFileBytesSync(imagePath);
    else {
      let clipboardPath = await getImagePathFromClipboard();
      if (clipboardPath && imagePath === basename13(clipboardPath))
        imageBuffer = getFsImplementation().readFileBytesSync(clipboardPath);
    }
  } catch (e) {
    return logError2(e), null;
  }
  if (!imageBuffer)
    return null;
  if (imageBuffer.length === 0)
    return logForDebugging(`Image file is empty: ${imagePath}`, { level: "warn" }), null;
  if (imageBuffer.length >= 2 && imageBuffer[0] === 66 && imageBuffer[1] === 77)
    imageBuffer = await (await getImageProcessor())(imageBuffer).png().toBuffer();
  let ext = extname6(imagePath).slice(1).toLowerCase() || "png", resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, imageBuffer.length, ext), base64Image = resized.buffer.toString("base64"), mediaType = detectImageFormatFromBase64(base64Image);
  return {
    path: imagePath,
    base64: base64Image,
    mediaType,
    dimensions: resized.dimensions
  };
}
var PASTE_THRESHOLD = 800, IMAGE_EXTENSION_REGEX;
var init_imagePaste = __esm(() => {
  init_execa();
  init_imageProcessor();
  init_debug();
  init_execFileNoThrow();
  init_fsOperations();
  init_imageResizer();
  init_log3();
  IMAGE_EXTENSION_REGEX = /\.(png|jpe?g|gif|webp)$/i;
});
