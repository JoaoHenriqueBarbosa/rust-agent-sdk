// Original: src/ink/bidi.ts
function needsBidi() {
  if (needsSoftwareBidi === void 0)
    needsSoftwareBidi = process.platform === "win32" || typeof process.env.WT_SESSION === "string" || process.env.TERM_PROGRAM === "vscode";
  return needsSoftwareBidi;
}
function getBidi() {
  if (!bidiInstance)
    bidiInstance = bidi_default();
  return bidiInstance;
}
function reorderBidi(characters) {
  if (!needsBidi() || characters.length === 0)
    return characters;
  let plainText = characters.map((c3) => c3.value).join("");
  if (!hasRTLCharacters(plainText))
    return characters;
  let bidi = getBidi(), { levels } = bidi.getEmbeddingLevels(plainText, "auto"), charLevels = [], offset = 0;
  for (let i4 = 0;i4 < characters.length; i4++)
    charLevels.push(levels[offset]), offset += characters[i4].value.length;
  let reordered = [...characters], maxLevel = Math.max(...charLevels);
  for (let level = maxLevel;level >= 1; level--) {
    let i4 = 0;
    while (i4 < reordered.length)
      if (charLevels[i4] >= level) {
        let j4 = i4 + 1;
        while (j4 < reordered.length && charLevels[j4] >= level)
          j4++;
        reverseRange(reordered, i4, j4 - 1), reverseRangeNumbers(charLevels, i4, j4 - 1), i4 = j4;
      } else
        i4++;
  }
  return reordered;
}
function reverseRange(arr, start, end) {
  while (start < end) {
    let temp = arr[start];
    arr[start] = arr[end], arr[end] = temp, start++, end--;
  }
}
function reverseRangeNumbers(arr, start, end) {
  while (start < end) {
    let temp = arr[start];
    arr[start] = arr[end], arr[end] = temp, start++, end--;
  }
}
function hasRTLCharacters(text) {
  return /[\u0590-\u05FF\uFB1D-\uFB4F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0780-\u07BF\u0700-\u074F]/u.test(text);
}
var bidiInstance, needsSoftwareBidi;
var init_bidi2 = __esm(() => {
  init_bidi();
});
