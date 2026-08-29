// function: detectArchBinary
function detectArchBinary(binary) {
  if (typeof binary === "string" || Array.isArray(binary))
    return binary;
  let { [arch]: archBinary } = binary;
  if (!archBinary)
    throw Error(`${arch} is not supported`);
  return archBinary;
}
