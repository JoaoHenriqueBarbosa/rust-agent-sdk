// function: makeReadableStream
function makeReadableStream(...args) {
  let ReadableStream2 = globalThis.ReadableStream;
  if (typeof ReadableStream2 > "u")
    throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new ReadableStream2(...args);
}
