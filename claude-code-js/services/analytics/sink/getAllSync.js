// var: getAllSync
var getAllSync = ([, stdout, stderr], options) => {
  if (!options.all)
    return;
  if (stdout === void 0)
    return stderr;
  if (stderr === void 0)
    return stdout;
  if (Array.isArray(stdout))
    return Array.isArray(stderr) ? [...stdout, ...stderr] : [...stdout, stripNewline(stderr, options, "all")];
  if (Array.isArray(stderr))
    return [stripNewline(stdout, options, "all"), ...stderr];
  if (isUint8Array(stdout) && isUint8Array(stderr))
    return concatUint8Arrays([stdout, stderr]);
  return `${stdout}${stderr}`;
};
