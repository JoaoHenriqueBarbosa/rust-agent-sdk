// function: getBytes
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer)
    parts.push(value);
  else if (isBlobLike(value))
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  else if (isAsyncIterable(value))
    for await (let chunk of value)
      parts.push(...await getBytes(chunk));
  else {
    let constructor = value?.constructor?.name;
    throw Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
  }
  return parts;
}
