// function: runCommands
async function runCommands(commands7, timeout) {
  let results = [];
  for (let command12 of commands7) {
    let [file2, ...parameters] = command12, result = await processUtils.execFile(file2, parameters, {
      encoding: "utf8",
      timeout
    });
    results.push(result);
  }
  return results;
}
