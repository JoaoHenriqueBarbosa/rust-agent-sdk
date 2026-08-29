// function: generateFunFactoid
function generateFunFactoid(stats, totalTokens) {
  let factoids = [];
  if (totalTokens > 0) {
    let matchingBooks = BOOK_COMPARISONS.filter((book) => totalTokens >= book.tokens);
    for (let book of matchingBooks) {
      let times = totalTokens / book.tokens;
      if (times >= 2)
        factoids.push(`You've used ~${Math.floor(times)}x more tokens than ${book.name}`);
      else
        factoids.push(`You've used the same number of tokens as ${book.name}`);
    }
  }
  if (stats.longestSession) {
    let sessionMinutes = stats.longestSession.duration / 60000;
    for (let comparison of TIME_COMPARISONS) {
      let ratio = sessionMinutes / comparison.minutes;
      if (ratio >= 2)
        factoids.push(`Your longest session is ~${Math.floor(ratio)}x longer than ${comparison.name}`);
    }
  }
  if (factoids.length === 0)
    return "";
  let randomIndex = Math.floor(Math.random() * factoids.length);
  return factoids[randomIndex];
}
