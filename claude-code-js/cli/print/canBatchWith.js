// function: canBatchWith
function canBatchWith(head, next2) {
  return next2 !== void 0 && next2.mode === "prompt" && next2.workload === head.workload && next2.isMeta === head.isMeta;
}
