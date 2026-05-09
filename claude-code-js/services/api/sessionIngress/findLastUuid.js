// function: findLastUuid
function findLastUuid(logs2) {
  if (!logs2)
    return;
  let entry = logs2.findLast((e) => ("uuid" in e) && e.uuid);
  return entry && "uuid" in entry ? entry.uuid : void 0;
}
