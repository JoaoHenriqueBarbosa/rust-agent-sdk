// function: getRandomValues
async function getRandomValues(size) {
  return (await crypto11).getRandomValues(new Uint8Array(size));
}
