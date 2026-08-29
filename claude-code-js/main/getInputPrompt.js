// function: getInputPrompt
async function getInputPrompt(prompt, inputFormat) {
  if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
    if (inputFormat === "stream-json")
      return process.stdin;
    process.stdin.setEncoding("utf8");
    let data = "", onData = (chunk2) => {
      data += chunk2;
    };
    process.stdin.on("data", onData);
    let timedOut = await peekForStdinData(process.stdin, 3000);
    if (process.stdin.off("data", onData), timedOut)
      process.stderr.write(`Warning: no stdin data received in 3s, proceeding without it. If piping from a slow command, redirect stdin explicitly: < /dev/null to skip, or wait longer.
`);
    return [prompt, data].filter(Boolean).join(`
`);
  }
  return prompt;
}
