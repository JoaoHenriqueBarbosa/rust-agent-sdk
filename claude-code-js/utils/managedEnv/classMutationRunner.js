// function: classMutationRunner
function classMutationRunner(record3) {
  var val = new Set(record3.originalValue.split(/\s+/).filter(Boolean));
  record3.mutations.forEach(function(m4) {
    return m4.mutate(val);
  }), queueIfNeeded(Array.from(val).filter(Boolean).join(" "), record3);
}
