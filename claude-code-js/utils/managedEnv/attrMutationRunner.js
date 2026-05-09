// function: attrMutationRunner
function attrMutationRunner(record3) {
  var val = record3.originalValue;
  record3.mutations.forEach(function(m4) {
    return val = m4.mutate(val);
  }), queueIfNeeded(val, record3);
}
