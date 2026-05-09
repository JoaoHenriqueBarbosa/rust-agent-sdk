// var: isStandardStream
var isStandardStream = (stream) => STANDARD_STREAMS.includes(stream), STANDARD_STREAMS, STANDARD_STREAMS_ALIASES, getStreamName = (fdNumber) => STANDARD_STREAMS_ALIASES[fdNumber] ?? `stdio[${fdNumber}]`;
