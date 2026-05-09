// function: generateWordSlug
function generateWordSlug() {
  let adjective = pickRandom(ADJECTIVES), verb = pickRandom(VERBS), noun = pickRandom(NOUNS);
  return `${adjective}-${verb}-${noun}`;
}
