// function: propsForError
function propsForError(value) {
  if (typeof value !== "object" || value === null)
    return "";
  return `; props: [${Object.getOwnPropertyNames(value).map((p) => `"${p}"`).join(", ")}]`;
}
