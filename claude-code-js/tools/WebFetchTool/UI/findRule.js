// function: findRule
function findRule(rules2, node2, options2) {
  for (var i5 = 0;i5 < rules2.length; i5++) {
    var rule = rules2[i5];
    if (filterValue(rule, node2, options2))
      return rule;
  }
  return;
}
