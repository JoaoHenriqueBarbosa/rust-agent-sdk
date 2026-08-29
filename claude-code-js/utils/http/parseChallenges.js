// function: parseChallenges
function parseChallenges(challenges) {
  let challengeRegex = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g, paramRegex = /(\w+)="([^"]*)"/g, parsedChallenges = [], match;
  while ((match = challengeRegex.exec(challenges)) !== null) {
    let scheme = match[1], paramsString = match[2], params = {}, paramMatch;
    while ((paramMatch = paramRegex.exec(paramsString)) !== null)
      params[paramMatch[1]] = paramMatch[2];
    parsedChallenges.push({ scheme, params });
  }
  return parsedChallenges;
}
