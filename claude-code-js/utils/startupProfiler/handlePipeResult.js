// function: handlePipeResult
function handlePipeResult(left, def, ctx) {
  if (aborted(left))
    return left;
  return def.out._zod.run({ value: left.value, issues: left.issues }, ctx);
}
