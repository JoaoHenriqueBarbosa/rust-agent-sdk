// function: handleScreenshot
async function handleScreenshot(stats, activeTab, setStatus) {
  setStatus("copying\u2026");
  let ansiText = renderStatsToAnsi(stats, activeTab), result = await copyAnsiToClipboard(ansiText);
  setStatus(result.success ? "copied!" : "copy failed"), setTimeout(setStatus, 2000, null);
}
