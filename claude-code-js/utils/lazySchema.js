// Original: src/utils/lazySchema.ts
function lazySchema(factory) {
  let cached2;
  return () => cached2 ??= factory();
}
