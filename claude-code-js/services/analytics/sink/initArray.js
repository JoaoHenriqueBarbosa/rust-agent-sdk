// var: initArray
var initArray = () => ({ contents: [] }), increment = () => 1, addArrayChunk = (convertedChunk, { contents }) => {
  return contents.push(convertedChunk), contents;
}, arrayMethods;
