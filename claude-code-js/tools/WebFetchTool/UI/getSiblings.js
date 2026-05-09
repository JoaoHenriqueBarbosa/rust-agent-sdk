// function: getSiblings
function getSiblings(elem) {
  let parent2 = getParent(elem);
  if (parent2 != null)
    return getChildren(parent2);
  let siblings = [elem], { prev, next } = elem;
  while (prev != null)
    siblings.unshift(prev), { prev } = prev;
  while (next != null)
    siblings.push(next), { next } = next;
  return siblings;
}
