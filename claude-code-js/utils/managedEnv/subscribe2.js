// function: subscribe2
function subscribe2(instance) {
  let key3 = getKey(instance), subs = subscribedInstances.get(key3) || /* @__PURE__ */ new Set;
  subs.add(instance), subscribedInstances.set(key3, subs);
}
