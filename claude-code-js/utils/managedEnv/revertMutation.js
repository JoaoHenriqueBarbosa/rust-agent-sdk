// function: revertMutation
function revertMutation(mutation) {
  mutation.elements.forEach(function(el) {
    return stopMutating(mutation, el);
  }), mutation.elements.clear(), mutations.delete(mutation);
}
