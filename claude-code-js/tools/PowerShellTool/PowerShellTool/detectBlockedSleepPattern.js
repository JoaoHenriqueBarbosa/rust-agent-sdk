// function: detectBlockedSleepPattern
function detectBlockedSleepPattern(command12) {
  let first = command12.trim().split(/[;|&\r\n]/)[0]?.trim() ?? "", m4 = /^(?:start-sleep|sleep)(?:\s+-s(?:econds)?)?\s+(\d+)\s*$/i.exec(first);
  if (!m4)
    return null;
  let secs = parseInt(m4[1], 10);
  if (secs < 2)
    return null;
  let rest = command12.trim().slice(first.length).replace(/^[\s;|&]+/, "");
  return rest ? `Start-Sleep ${secs} followed by: ${rest}` : `standalone Start-Sleep ${secs}`;
}
