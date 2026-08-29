// function: createSearcher
function createSearcher(pattern, options2) {
  for (let i5 = 0, len = registeredSearchers.length;i5 < len; i5 += 1) {
    let searcherClass = registeredSearchers[i5];
    if (searcherClass.condition(pattern, options2))
      return new searcherClass(pattern, options2);
  }
  return new BitapSearch(pattern, options2);
}
