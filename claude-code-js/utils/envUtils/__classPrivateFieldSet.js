// function: __classPrivateFieldSet
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
