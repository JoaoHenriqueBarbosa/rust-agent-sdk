// Original: src/utils/screenshotClipboard.ts
import { mkdir as mkdir35, unlink as unlink18, writeFile as writeFile41 } from "fs/promises";
import { tmpdir as tmpdir10 } from "os";
import { join as join131 } from "path";
async function copyAnsiToClipboard(ansiText, options2) {
  try {
    let tempDir = join131(tmpdir10(), "claude-code-screenshots");
    await mkdir35(tempDir, { recursive: !0 });
    let pngPath = join131(tempDir, `screenshot-${Date.now()}.png`), pngBuffer = ansiToPng(ansiText, options2);
    await writeFile41(pngPath, pngBuffer);
    let result = await copyPngToClipboard(pngPath);
    try {
      await unlink18(pngPath);
    } catch {}
    return result;
  } catch (error44) {
    return logError2(error44), {
      success: !1,
      message: `Failed to copy screenshot: ${error44 instanceof Error ? error44.message : "Unknown error"}`
    };
  }
}
async function copyPngToClipboard(pngPath) {
  let platform6 = getPlatform();
  if (platform6 === "macos") {
    let script = `set the clipboard to (read (POSIX file "${pngPath.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}") as \xABclass PNGf\xBB)`, result = await execFileNoThrowWithCwd("osascript", ["-e", script], {
      timeout: 5000
    });
    if (result.code === 0)
      return { success: !0, message: "Screenshot copied to clipboard" };
    return {
      success: !1,
      message: `Failed to copy to clipboard: ${result.stderr}`
    };
  }
  if (platform6 === "linux") {
    if ((await execFileNoThrowWithCwd("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", pngPath], { timeout: 5000 })).code === 0)
      return { success: !0, message: "Screenshot copied to clipboard" };
    if ((await execFileNoThrowWithCwd("xsel", ["--clipboard", "--input", "--type", "image/png"], { timeout: 5000 })).code === 0)
      return { success: !0, message: "Screenshot copied to clipboard" };
    return {
      success: !1,
      message: "Failed to copy to clipboard. Please install xclip or xsel: sudo apt install xclip"
    };
  }
  if (platform6 === "windows") {
    let psScript = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${pngPath.replace(/'/g, "''")}'))`, result = await execFileNoThrowWithCwd("powershell", ["-NoProfile", "-Command", psScript], { timeout: 5000 });
    if (result.code === 0)
      return { success: !0, message: "Screenshot copied to clipboard" };
    return {
      success: !1,
      message: `Failed to copy to clipboard: ${result.stderr}`
    };
  }
  return {
    success: !1,
    message: `Screenshot to clipboard is not supported on ${platform6}`
  };
}
var init_screenshotClipboard = __esm(() => {
  init_ansiToPng();
  init_execFileNoThrow();
  init_log3();
  init_platform();
});
