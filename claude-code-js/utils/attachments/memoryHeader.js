// function: memoryHeader
function memoryHeader(path21, mtimeMs) {
  let staleness = memoryFreshnessText(mtimeMs);
  return staleness ? `${staleness}

Memory: ${path21}:` : `Memory (saved ${memoryAge(mtimeMs)}): ${path21}:`;
}
