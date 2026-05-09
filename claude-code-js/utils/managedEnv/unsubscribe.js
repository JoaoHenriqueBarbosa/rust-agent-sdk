// function: unsubscribe
function unsubscribe(instance) {
  subscribedInstances.forEach((s2) => s2.delete(instance));
}
