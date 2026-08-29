// Original: src/utils/userPromptKeywords.ts
function matchesNegativeKeyword(input) {
  let lowerInput = input.toLowerCase();
  return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(lowerInput);
}
function matchesKeepGoingKeyword(input) {
  let lowerInput = input.toLowerCase().trim();
  if (lowerInput === "continue")
    return !0;
  return /\b(keep going|go on)\b/.test(lowerInput);
}
