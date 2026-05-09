// function: newMutation
function newMutation(m4) {
  if (typeof document > "u")
    return nullController;
  return mutations.add(m4), refreshElementsSet(m4), {
    revert: function() {
      revertMutation(m4);
    }
  };
}
