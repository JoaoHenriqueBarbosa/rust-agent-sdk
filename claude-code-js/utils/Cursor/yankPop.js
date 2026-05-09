// function: yankPop
function yankPop() {
  if (!lastActionWasYank || killRing.length <= 1)
    return null;
  return killRingIndex = (killRingIndex + 1) % killRing.length, { text: killRing[killRingIndex] ?? "", start: lastYankStart, length: lastYankLength };
}
