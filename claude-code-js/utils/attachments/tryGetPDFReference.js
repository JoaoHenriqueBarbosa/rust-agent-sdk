// function: tryGetPDFReference
async function tryGetPDFReference(filename) {
  let ext = parse17(filename).ext.toLowerCase();
  if (!isPDFExtension(ext))
    return null;
  try {
    let [stats, pageCount] = await Promise.all([
      getFsImplementation().stat(filename),
      getPDFPageCount(filename)
    ]), effectivePageCount = pageCount ?? Math.ceil(stats.size / 102400);
    if (effectivePageCount > PDF_AT_MENTION_INLINE_THRESHOLD)
      return logEvent("tengu_pdf_reference_attachment", {
        pageCount: effectivePageCount,
        fileSize: stats.size,
        hadPdfinfo: pageCount !== null
      }), {
        type: "pdf_reference",
        filename,
        pageCount: effectivePageCount,
        fileSize: stats.size,
        displayPath: relative19(getCwd(), filename)
      };
  } catch {}
  return null;
}
