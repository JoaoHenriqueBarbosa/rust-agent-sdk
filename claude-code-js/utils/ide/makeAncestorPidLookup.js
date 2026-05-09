// function: makeAncestorPidLookup
function makeAncestorPidLookup() {
  let promise3 = null;
  return () => {
    if (!promise3)
      promise3 = getAncestorPidsAsync(process.ppid, 10).then((pids) => new Set(pids));
    return promise3;
  };
}
