// var: getParentNodeCount
var getParentNodeCount = ({ parentNode }) => {
  let count3 = 0;
  while (parentNode)
    count3++, parentNode = parentNode.parentNode;
  return count3;
}, Node3;
