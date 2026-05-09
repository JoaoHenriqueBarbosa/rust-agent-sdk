// function: flattenError2
function flattenError2(err2) {
  return err2 instanceof Error ? "errors" in err2 && Array.isArray(err2.errors) ? err2.errors.map(flattenError2).join(", ") : ("cause" in err2) && err2.cause instanceof Error ? `${err2}: ${flattenError2(err2.cause)}` : err2.message : `${err2}`;
}
