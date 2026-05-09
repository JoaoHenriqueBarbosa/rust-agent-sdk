// var: isTemplateString
var isTemplateString = (templates) => Array.isArray(templates) && Array.isArray(templates.raw), parseTemplates = (templates, expressions) => {
  let tokens = [];
  for (let [index, template] of templates.entries())
    tokens = parseTemplate({
      templates,
      expressions,
      tokens,
      index,
      template
    });
  if (tokens.length === 0)
    throw TypeError("Template script must not be empty");
  let [file2, ...commandArguments] = tokens;
  return [file2, commandArguments, {}];
}, parseTemplate = ({ templates, expressions, tokens, index, template }) => {
  if (template === void 0)
    throw TypeError(`Invalid backslash sequence: ${templates.raw[index]}`);
  let { nextTokens, leadingWhitespaces, trailingWhitespaces } = splitByWhitespaces(template, templates.raw[index]), newTokens = concatTokens(tokens, nextTokens, leadingWhitespaces);
  if (index === expressions.length)
    return newTokens;
  let expression = expressions[index], expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
  return concatTokens(newTokens, expressionTokens, trailingWhitespaces);
}, splitByWhitespaces = (template, rawTemplate) => {
  if (rawTemplate.length === 0)
    return { nextTokens: [], leadingWhitespaces: !1, trailingWhitespaces: !1 };
  let nextTokens = [], templateStart = 0, leadingWhitespaces = DELIMITERS.has(rawTemplate[0]);
  for (let templateIndex = 0, rawIndex = 0;templateIndex < template.length; templateIndex += 1, rawIndex += 1) {
    let rawCharacter = rawTemplate[rawIndex];
    if (DELIMITERS.has(rawCharacter)) {
      if (templateStart !== templateIndex)
        nextTokens.push(template.slice(templateStart, templateIndex));
      templateStart = templateIndex + 1;
    } else if (rawCharacter === "\\") {
      let nextRawCharacter = rawTemplate[rawIndex + 1];
      if (nextRawCharacter === `
`)
        templateIndex -= 1, rawIndex += 1;
      else if (nextRawCharacter === "u" && rawTemplate[rawIndex + 2] === "{")
        rawIndex = rawTemplate.indexOf("}", rawIndex + 3);
      else
        rawIndex += ESCAPE_LENGTH[nextRawCharacter] ?? 1;
    }
  }
  let trailingWhitespaces = templateStart === template.length;
  if (!trailingWhitespaces)
    nextTokens.push(template.slice(templateStart));
  return { nextTokens, leadingWhitespaces, trailingWhitespaces };
}, DELIMITERS, ESCAPE_LENGTH, concatTokens = (tokens, nextTokens, isSeparated) => isSeparated || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
