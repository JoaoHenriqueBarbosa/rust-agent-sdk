// function: joinTextAtSeam
function joinTextAtSeam(a2, b) {
  let lastA = a2.at(-1), firstB = b[0];
  if (lastA?.type === "text" && firstB?.type === "text")
    return [...a2.slice(0, -1), { ...lastA, text: lastA.text + `
` }, ...b];
  return [...a2, ...b];
}
