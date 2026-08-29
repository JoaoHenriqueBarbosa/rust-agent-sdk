// function: readClientSecret
async function readClientSecret() {
  let envSecret = process.env.MCP_CLIENT_SECRET;
  if (envSecret)
    return envSecret;
  if (!process.stdin.isTTY)
    throw Error("No TTY available to prompt for client secret. Set MCP_CLIENT_SECRET env var instead.");
  return new Promise((resolve24, reject2) => {
    process.stderr.write("Enter OAuth client secret: "), process.stdin.setRawMode?.(!0);
    let secret = "", onData = (ch2) => {
      let c3 = ch2.toString();
      if (c3 === `
` || c3 === "\r")
        process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", onData), process.stderr.write(`
`), resolve24(secret);
      else if (c3 === "\x03")
        process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", onData), reject2(Error("Cancelled"));
      else if (c3 === "\x7F" || c3 === "\b")
        secret = secret.slice(0, -1);
      else
        secret += c3;
    };
    process.stdin.on("data", onData);
  });
}
