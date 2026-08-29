// Original: src/utils/git/gitConfigParser.ts
import { readFile as readFile2 } from "fs/promises";
import { join as join10 } from "path";
async function parseGitConfigValue(gitDir, section, subsection, key) {
  try {
    let config2 = await readFile2(join10(gitDir, "config"), "utf-8");
    return parseConfigString(config2, section, subsection, key);
  } catch {
    return null;
  }
}
function parseConfigString(config2, section, subsection, key) {
  let lines = config2.split(`
`), sectionLower = section.toLowerCase(), keyLower = key.toLowerCase(), inSection = !1;
  for (let line of lines) {
    let trimmed = line.trim();
    if (trimmed.length === 0 || trimmed[0] === "#" || trimmed[0] === ";")
      continue;
    if (trimmed[0] === "[") {
      inSection = matchesSectionHeader(trimmed, sectionLower, subsection);
      continue;
    }
    if (!inSection)
      continue;
    let parsed = parseKeyValue(trimmed);
    if (parsed && parsed.key.toLowerCase() === keyLower)
      return parsed.value;
  }
  return null;
}
function parseKeyValue(line) {
  let i2 = 0;
  while (i2 < line.length && isKeyChar(line[i2]))
    i2++;
  if (i2 === 0)
    return null;
  let key = line.slice(0, i2);
  while (i2 < line.length && (line[i2] === " " || line[i2] === "\t"))
    i2++;
  if (i2 >= line.length || line[i2] !== "=")
    return null;
  i2++;
  while (i2 < line.length && (line[i2] === " " || line[i2] === "\t"))
    i2++;
  let value = parseValue(line, i2);
  return { key, value };
}
function parseValue(line, start) {
  let result = "", inQuote = !1, i2 = start;
  while (i2 < line.length) {
    let ch = line[i2];
    if (!inQuote && (ch === "#" || ch === ";"))
      break;
    if (ch === '"') {
      inQuote = !inQuote, i2++;
      continue;
    }
    if (ch === "\\" && i2 + 1 < line.length) {
      let next = line[i2 + 1];
      if (inQuote) {
        switch (next) {
          case "n":
            result += `
`;
            break;
          case "t":
            result += "\t";
            break;
          case "b":
            result += "\b";
            break;
          case '"':
            result += '"';
            break;
          case "\\":
            result += "\\";
            break;
          default:
            result += next;
            break;
        }
        i2 += 2;
        continue;
      }
      if (next === "\\") {
        result += "\\", i2 += 2;
        continue;
      }
    }
    result += ch, i2++;
  }
  if (!inQuote)
    result = trimTrailingWhitespace(result);
  return result;
}
function trimTrailingWhitespace(s) {
  let end = s.length;
  while (end > 0 && (s[end - 1] === " " || s[end - 1] === "\t"))
    end--;
  return s.slice(0, end);
}
function matchesSectionHeader(line, sectionLower, subsection) {
  let i2 = 1;
  while (i2 < line.length && line[i2] !== "]" && line[i2] !== " " && line[i2] !== "\t" && line[i2] !== '"')
    i2++;
  if (line.slice(1, i2).toLowerCase() !== sectionLower)
    return !1;
  if (subsection === null)
    return i2 < line.length && line[i2] === "]";
  while (i2 < line.length && (line[i2] === " " || line[i2] === "\t"))
    i2++;
  if (i2 >= line.length || line[i2] !== '"')
    return !1;
  i2++;
  let foundSubsection = "";
  while (i2 < line.length && line[i2] !== '"') {
    if (line[i2] === "\\" && i2 + 1 < line.length) {
      let next = line[i2 + 1];
      if (next === "\\" || next === '"') {
        foundSubsection += next, i2 += 2;
        continue;
      }
      foundSubsection += next, i2 += 2;
      continue;
    }
    foundSubsection += line[i2], i2++;
  }
  if (i2 >= line.length || line[i2] !== '"')
    return !1;
  if (i2++, i2 >= line.length || line[i2] !== "]")
    return !1;
  return foundSubsection === subsection;
}
function isKeyChar(ch) {
  return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "-";
}
var init_gitConfigParser = () => {};
