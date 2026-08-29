// var: identity3
var identity3 = (value) => value, noop3 = () => {
  return;
}, getContentsProperty = ({ contents }) => contents, throwObjectStream = (chunk) => {
  throw Error(`Streams in object mode are not supported: ${String(chunk)}`);
}, getLengthProperty = (convertedChunk) => convertedChunk.length;
