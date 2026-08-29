// function: readFileRange
async function readFileRange(path2, offset, maxBytes) {
  let __stack = [];
  try {
    const fh = __using(__stack, await open(path2, "r"), 1);
    let size = (await fh.stat()).size;
    if (size <= offset)
      return null;
    let bytesToRead = Math.min(size - offset, maxBytes);
    let buffer = Buffer.allocUnsafe(bytesToRead);
    let totalRead = 0;
    while (totalRead < bytesToRead) {
      let { bytesRead } = await fh.read(buffer, totalRead, bytesToRead - totalRead, offset + totalRead);
      if (bytesRead === 0)
        break;
      totalRead += bytesRead;
    }
    return {
      content: buffer.toString("utf8", 0, totalRead),
      bytesRead: totalRead,
      bytesTotal: size
    };
  } catch (_catch) {
    var _err = _catch, _hasErr = 1;
  } finally {
    var _promise = __callDispose(__stack, _err, _hasErr);
    _promise && await _promise;
  }
}
