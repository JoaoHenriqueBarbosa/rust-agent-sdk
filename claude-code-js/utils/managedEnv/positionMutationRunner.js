// function: positionMutationRunner
function positionMutationRunner(record3) {
  var val = record3.originalValue;
  record3.mutations.forEach(function(m4) {
    var selectors = m4.mutate(), newNodes = _loadDOMNodes(selectors);
    val = newNodes || val;
  }), queueIfNeeded(val, record3);
}
