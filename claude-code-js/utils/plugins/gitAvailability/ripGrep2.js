// function: ripGrep2
async function ripGrep2(args, target, abortSignal, config8 = { command: "rg" }) {
  let { command: command12, args: commandArgs = [], argv0 } = config8, child = spawn3(command12, [...commandArgs, ...args, target], {
    argv0,
    signal: abortSignal,
    timeout: 1e4,
    windowsHide: !0
  }), [stdout, stderr, code] = await Promise.all([
    text(child.stdout),
    text(child.stderr),
    new Promise((resolve15, reject) => {
      child.on("close", resolve15), child.on("error", reject);
    })
  ]);
  if (code === 0)
    return stdout.trim().split(`
`).filter(Boolean);
  if (code === 1)
    return [];
  throw Error(`ripgrep failed with exit code ${code}: ${stderr}`);
}
