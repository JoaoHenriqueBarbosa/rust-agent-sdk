// function: concat
async function concat(sources) {
  return function() {
    let streams = sources.map((x3) => typeof x3 === "function" ? x3() : x3).map(toStream);
    return Readable8.from(async function* () {
      for (let stream10 of streams)
        for await (let chunk of stream10)
          yield chunk;
    }());
  };
}
