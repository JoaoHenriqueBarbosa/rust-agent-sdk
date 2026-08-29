// Original: src/utils/pdf.ts
import { randomUUID as randomUUID20 } from "crypto";
import { mkdir as mkdir21, readdir as readdir13, readFile as readFile32 } from "fs/promises";
import { join as join91 } from "path";
async function readPDF(filePath) {
  try {
    let originalSize = (await getFsImplementation().stat(filePath)).size;
    if (originalSize === 0)
      return {
        success: !1,
        error: { reason: "empty", message: `PDF file is empty: ${filePath}` }
      };
    if (originalSize > PDF_TARGET_RAW_SIZE)
      return {
        success: !1,
        error: {
          reason: "too_large",
          message: `PDF file exceeds maximum allowed size of ${formatFileSize(PDF_TARGET_RAW_SIZE)}.`
        }
      };
    let fileBuffer = await readFile32(filePath);
    if (!fileBuffer.subarray(0, 5).toString("ascii").startsWith("%PDF-"))
      return {
        success: !1,
        error: {
          reason: "corrupted",
          message: `File is not a valid PDF (missing %PDF- header): ${filePath}`
        }
      };
    let base644 = fileBuffer.toString("base64");
    return {
      success: !0,
      data: {
        type: "pdf",
        file: {
          filePath,
          base64: base644,
          originalSize
        }
      }
    };
  } catch (e) {
    return {
      success: !1,
      error: {
        reason: "unknown",
        message: errorMessage(e)
      }
    };
  }
}
async function getPDFPageCount(filePath) {
  let { code, stdout } = await execFileNoThrow("pdfinfo", [filePath], {
    timeout: 1e4,
    useCwd: !1
  });
  if (code !== 0)
    return null;
  let match = /^Pages:\s+(\d+)/m.exec(stdout);
  if (!match)
    return null;
  let count3 = parseInt(match[1], 10);
  return isNaN(count3) ? null : count3;
}
async function isPdftoppmAvailable() {
  if (pdftoppmAvailable !== void 0)
    return pdftoppmAvailable;
  let { code, stderr } = await execFileNoThrow("pdftoppm", ["-v"], {
    timeout: 5000,
    useCwd: !1
  });
  return pdftoppmAvailable = code === 0 || stderr.length > 0, pdftoppmAvailable;
}
async function extractPDFPages(filePath, options2) {
  try {
    let originalSize = (await getFsImplementation().stat(filePath)).size;
    if (originalSize === 0)
      return {
        success: !1,
        error: { reason: "empty", message: `PDF file is empty: ${filePath}` }
      };
    if (originalSize > PDF_MAX_EXTRACT_SIZE)
      return {
        success: !1,
        error: {
          reason: "too_large",
          message: `PDF file exceeds maximum allowed size for text extraction (${formatFileSize(PDF_MAX_EXTRACT_SIZE)}).`
        }
      };
    if (!await isPdftoppmAvailable())
      return {
        success: !1,
        error: {
          reason: "unavailable",
          message: "pdftoppm is not installed. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF page rendering."
        }
      };
    let uuid8 = randomUUID20(), outputDir = join91(getToolResultsDir(), `pdf-${uuid8}`);
    await mkdir21(outputDir, { recursive: !0 });
    let prefix = join91(outputDir, "page"), args = ["-jpeg", "-r", "100"];
    if (options2?.firstPage)
      args.push("-f", String(options2.firstPage));
    if (options2?.lastPage && options2.lastPage !== 1 / 0)
      args.push("-l", String(options2.lastPage));
    args.push(filePath, prefix);
    let { code, stderr } = await execFileNoThrow("pdftoppm", args, {
      timeout: 120000,
      useCwd: !1
    });
    if (code !== 0) {
      if (/password/i.test(stderr))
        return {
          success: !1,
          error: {
            reason: "password_protected",
            message: "PDF is password-protected. Please provide an unprotected version."
          }
        };
      if (/damaged|corrupt|invalid/i.test(stderr))
        return {
          success: !1,
          error: {
            reason: "corrupted",
            message: "PDF file is corrupted or invalid."
          }
        };
      return {
        success: !1,
        error: { reason: "unknown", message: `pdftoppm failed: ${stderr}` }
      };
    }
    let imageFiles = (await readdir13(outputDir)).filter((f) => f.endsWith(".jpg")).sort();
    if (imageFiles.length === 0)
      return {
        success: !1,
        error: {
          reason: "corrupted",
          message: "pdftoppm produced no output pages. The PDF may be invalid."
        }
      };
    let count3 = imageFiles.length;
    return {
      success: !0,
      data: {
        type: "parts",
        file: {
          filePath,
          originalSize,
          outputDir,
          count: count3
        }
      }
    };
  } catch (e) {
    return {
      success: !1,
      error: {
        reason: "unknown",
        message: errorMessage(e)
      }
    };
  }
}
var pdftoppmAvailable;
var init_pdf = __esm(() => {
  init_errors();
  init_execFileNoThrow();
  init_format();
  init_fsOperations();
  init_toolResultStorage();
});
