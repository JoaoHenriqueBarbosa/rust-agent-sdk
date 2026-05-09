// Shared module state and imports
// Original: src/services/api/sessionIngress.ts
var lastUuidMap, MAX_RETRIES = 10, BASE_DELAY_MS2 = 500, sequentialAppendBySession;

// node_modules/diff/lib/index.mjs
var characterDiff, extendedWordChars = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}", tokenizeIncludingWhitespace, wordDiff, wordWithSpaceDiff, lineDiff, sentenceDiff, cssDiff, jsonDiff, arrayDiff;

