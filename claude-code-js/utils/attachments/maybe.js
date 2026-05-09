// function: maybe
async function maybe(label, f) {
  let startTime = Date.now();
  try {
    let result = await f(), duration3 = Date.now() - startTime;
    if (Math.random() < 0.05) {
      let attachmentSizeBytes = result.filter((a2) => a2 !== void 0 && a2 !== null).reduce((total, attachment) => {
        return total + jsonStringify(attachment).length;
      }, 0);
      logEvent("tengu_attachment_compute_duration", {
        label,
        duration_ms: duration3,
        attachment_size_bytes: attachmentSizeBytes,
        attachment_count: result.length
      });
    }
    return result;
  } catch (e) {
    let duration3 = Date.now() - startTime;
    if (Math.random() < 0.05)
      logEvent("tengu_attachment_compute_duration", {
        label,
        duration_ms: duration3,
        error: !0
      });
    return logError2(e), logAntError(`Attachment error in ${label}`, e), [];
  }
}
