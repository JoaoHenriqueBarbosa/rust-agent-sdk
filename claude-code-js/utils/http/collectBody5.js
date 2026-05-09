// var: collectBody5
var collectBody5 = async (streamBody = new Uint8Array, context) => {
  if (streamBody instanceof Uint8Array)
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  if (!streamBody)
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array);
  let fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(await fromContext);
};
