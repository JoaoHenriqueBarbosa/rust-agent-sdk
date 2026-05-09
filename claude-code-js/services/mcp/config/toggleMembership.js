// function: toggleMembership
function toggleMembership(list2, name3, shouldContain) {
  if (list2.includes(name3) === shouldContain)
    return list2;
  return shouldContain ? [...list2, name3] : list2.filter((s2) => s2 !== name3);
}
