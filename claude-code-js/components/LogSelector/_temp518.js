// function: _temp518
function _temp518(fuseIndex_0, debouncedDeepSearchQuery_0, setDeepSearchResults_0, setIsSearching_0) {
  let results = fuseIndex_0.search(debouncedDeepSearchQuery_0);
  results.sort(_temp332), setDeepSearchResults_0({
    results: results.map(_temp426),
    query: debouncedDeepSearchQuery_0
  }), setIsSearching_0(!1);
}
