// function: cleanupStream
function cleanupStream(stream10) {
  if (!stream10)
    return;
  try {
    if (!stream10.controller.signal.aborted)
      stream10.controller.abort();
  } catch {}
}
