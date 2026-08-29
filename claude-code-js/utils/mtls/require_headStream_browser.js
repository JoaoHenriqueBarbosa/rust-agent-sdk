// var: require_headStream_browser
var require_headStream_browser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.headStream = headStream;
  async function headStream(stream5, bytes) {
    let byteLengthCounter = 0, chunks = [], reader = stream5.getReader(), isDone = !1;
    while (!isDone) {
      let { done, value } = await reader.read();
      if (value)
        chunks.push(value), byteLengthCounter += value?.byteLength ?? 0;
      if (byteLengthCounter >= bytes)
        break;
      isDone = done;
    }
    reader.releaseLock();
    let collected = new Uint8Array(Math.min(bytes, byteLengthCounter)), offset = 0;
    for (let chunk of chunks) {
      if (chunk.byteLength > collected.byteLength - offset) {
        collected.set(chunk.subarray(0, collected.byteLength - offset), offset);
        break;
      } else
        collected.set(chunk, offset);
      offset += chunk.length;
    }
    return collected;
  }
});
