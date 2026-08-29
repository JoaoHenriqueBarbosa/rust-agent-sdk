// function: readFileAsyncOrNull
async function readFileAsyncOrNull(path16) {
  try {
    return await readFile22(path16, "utf-8");
  } catch {
    return null;
  }
}
