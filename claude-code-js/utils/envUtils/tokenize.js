// var: tokenize
var tokenize = (input) => {
  let current = 0, tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === "\\") {
      current++;
      continue;
    }
    if (char === "{") {
      tokens.push({
        type: "brace",
        value: "{"
      }), current++;
      continue;
    }
    if (char === "}") {
      tokens.push({
        type: "brace",
        value: "}"
      }), current++;
      continue;
    }
    if (char === "[") {
      tokens.push({
        type: "paren",
        value: "["
      }), current++;
      continue;
    }
    if (char === "]") {
      tokens.push({
        type: "paren",
        value: "]"
      }), current++;
      continue;
    }
    if (char === ":") {
      tokens.push({
        type: "separator",
        value: ":"
      }), current++;
      continue;
    }
    if (char === ",") {
      tokens.push({
        type: "delimiter",
        value: ","
      }), current++;
      continue;
    }
    if (char === '"') {
      let value = "", danglingQuote = !1;
      char = input[++current];
      while (char !== '"') {
        if (current === input.length) {
          danglingQuote = !0;
          break;
        }
        if (char === "\\") {
          if (current++, current === input.length) {
            danglingQuote = !0;
            break;
          }
          value += char + input[current], char = input[++current];
        } else
          value += char, char = input[++current];
      }
      if (char = input[++current], !danglingQuote)
        tokens.push({
          type: "string",
          value
        });
      continue;
    }
    if (char && /\s/.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (char && NUMBERS.test(char) || char === "-" || char === ".") {
      let value = "";
      if (char === "-")
        value += char, char = input[++current];
      while (char && NUMBERS.test(char) || char === ".")
        value += char, char = input[++current];
      tokens.push({
        type: "number",
        value
      });
      continue;
    }
    let LETTERS = /[a-z]/i;
    if (char && LETTERS.test(char)) {
      let value = "";
      while (char && LETTERS.test(char)) {
        if (current === input.length)
          break;
        value += char, char = input[++current];
      }
      if (value == "true" || value == "false" || value === "null")
        tokens.push({
          type: "name",
          value
        });
      else {
        current++;
        continue;
      }
      continue;
    }
    current++;
  }
  return tokens;
}, strip = (tokens) => {
  if (tokens.length === 0)
    return tokens;
  let lastToken = tokens[tokens.length - 1];
  switch (lastToken.type) {
    case "separator":
      return tokens = tokens.slice(0, tokens.length - 1), strip(tokens);
      break;
    case "number":
      let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
      if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-")
        return tokens = tokens.slice(0, tokens.length - 1), strip(tokens);
    case "string":
      let tokenBeforeTheLastToken = tokens[tokens.length - 2];
      if (tokenBeforeTheLastToken?.type === "delimiter")
        return tokens = tokens.slice(0, tokens.length - 1), strip(tokens);
      else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{")
        return tokens = tokens.slice(0, tokens.length - 1), strip(tokens);
      break;
    case "delimiter":
      return tokens = tokens.slice(0, tokens.length - 1), strip(tokens);
      break;
  }
  return tokens;
}, unstrip = (tokens) => {
  let tail = [];
  if (tokens.map((token) => {
    if (token.type === "brace")
      if (token.value === "{")
        tail.push("}");
      else
        tail.splice(tail.lastIndexOf("}"), 1);
    if (token.type === "paren")
      if (token.value === "[")
        tail.push("]");
      else
        tail.splice(tail.lastIndexOf("]"), 1);
  }), tail.length > 0)
    tail.reverse().map((item) => {
      if (item === "}")
        tokens.push({
          type: "brace",
          value: "}"
        });
