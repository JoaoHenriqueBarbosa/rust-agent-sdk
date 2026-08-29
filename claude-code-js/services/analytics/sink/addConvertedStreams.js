// var: addConvertedStreams
var addConvertedStreams = (subprocess, { encoding }) => {
  let concurrentStreams = initializeConcurrentStreams();
  subprocess.readable = createReadable.bind(void 0, { subprocess, concurrentStreams, encoding }), subprocess.writable = createWritable.bind(void 0, { subprocess, concurrentStreams }), subprocess.duplex = createDuplex.bind(void 0, { subprocess, concurrentStreams, encoding }), subprocess.iterable = createIterable.bind(void 0, subprocess, encoding), subprocess[Symbol.asyncIterator] = createIterable.bind(void 0, subprocess, encoding, {});
};
