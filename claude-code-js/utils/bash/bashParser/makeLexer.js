// function: makeLexer
function makeLexer(src) {
  return {
    src,
    len: src.length,
    i: 0,
    b: 0,
    heredocs: [],
    byteTable: null
  };
}
