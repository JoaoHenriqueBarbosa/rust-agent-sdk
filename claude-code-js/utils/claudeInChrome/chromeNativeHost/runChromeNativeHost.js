// function: runChromeNativeHost
async function runChromeNativeHost() {
  log3("Initializing...");
  let host = new ChromeNativeHost, messageReader = new ChromeMessageReader;
  await host.start();
  while (!0) {
    let message = await messageReader.read();
    if (message === null)
      break;
    await host.handleMessage(message);
  }
  await host.stop();
}
