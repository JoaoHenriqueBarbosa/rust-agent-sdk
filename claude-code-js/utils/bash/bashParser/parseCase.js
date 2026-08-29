// function: parseCase
function parseCase(P2, caseTok) {
  let caseKw = leaf(P2, "case", caseTok), kids = [caseKw];
  skipBlanks(P2.L);
  let word = parseWord(P2, "arg");
  if (word)
    kids.push(word);
  skipBlanks(P2.L), consumeKeyword(P2, "in", kids), skipNewlines(P2);
  while (!0) {
    skipBlanks(P2.L), skipNewlines(P2);
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "arg");
    if (t2.type === "WORD" && t2.value === "esac") {
      kids.push(leaf(P2, "esac", t2));
      break;
    }
    if (t2.type === "EOF")
      break;
    restoreLex(P2.L, save);
    let item = parseCaseItem(P2);
    if (!item)
      break;
    kids.push(item);
  }
  let last2 = kids[kids.length - 1];
  return mk(P2, "case_statement", caseKw.startIndex, last2.endIndex, kids);
}
