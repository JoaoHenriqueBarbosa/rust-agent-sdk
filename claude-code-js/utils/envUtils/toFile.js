// function: toFile
async function toFile(value, name, options) {
  if (checkFileSupport(), value = await value, name || (name = getName(value)), isFileLike(value)) {
    if (value instanceof File && name == null && options == null)
      return value;
    return makeFile([await value.arrayBuffer()], name ?? value.name, {
      type: value.type,
      lastModified: value.lastModified,
      ...options
    });
  }
  if (isResponseLike(value)) {
    let blob = await value.blob();
    return name || (name = new URL(value.url).pathname.split(/[\\/]/).pop()), makeFile(await getBytes(blob), name, options);
  }
  let parts = await getBytes(value);
  if (!options?.type) {
    let type = parts.find((part) => typeof part === "object" && ("type" in part) && part.type);
    if (typeof type === "string")
      options = { ...options, type };
  }
  return makeFile(parts, name, options);
}
