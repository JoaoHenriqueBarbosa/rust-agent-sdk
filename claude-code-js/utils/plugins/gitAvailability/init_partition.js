// var: init_partition
var init_partition = __esm(() => {
  init__createAggregator();
  partition2 = _createAggregator_default(function(result, value, key) {
    result[key ? 0 : 1].push(value);
  }, function() {
    return [[], []];
  }), partition_default = partition2;
});
