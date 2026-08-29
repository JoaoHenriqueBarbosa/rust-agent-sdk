// function: getChildFunc
function getChildFunc(next, adapter2) {
  return (elem) => {
    let parent2 = adapter2.getParent(elem);
    return parent2 != null && adapter2.isTag(parent2) && next(elem);
  };
}
