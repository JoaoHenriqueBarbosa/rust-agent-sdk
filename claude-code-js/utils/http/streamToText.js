// function: streamToText
function streamToText(stream10) {
  return new Promise((resolve9, reject) => {
    let buffer = [];
    stream10.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk))
        buffer.push(chunk);
      else
        buffer.push(Buffer.from(chunk));
    }), stream10.on("end", () => {
      resolve9(Buffer.concat(buffer).toString("utf8"));
    }), stream10.on("error", (e) => {
      if (e && e?.name === "AbortError")
        reject(e);
      else
        reject(new RestError(`Error reading response as text: ${e.message}`, {
          code: RestError.PARSE_ERROR
        }));
    });
  });
}
