// var: mapCommandAsync
var mapCommandAsync = ({ file: file2, commandArguments }) => parseCommand(file2, commandArguments), mapCommandSync = ({ file: file2, commandArguments }) => ({ ...parseCommand(file2, commandArguments), isSync: !0 }), parseCommand = (command, unusedArguments) => {
  if (unusedArguments.length > 0)
    throw TypeError(`The command and its arguments must be passed as a single string: ${command} ${unusedArguments}.`);
  let [file2, ...commandArguments] = parseCommandString(command);
  return { file: file2, commandArguments };
}, parseCommandString = (command) => {
  if (typeof command !== "string")
    throw TypeError(`The command must be a string: ${String(command)}.`);
  let trimmedCommand = command.trim();
  if (trimmedCommand === "")
    return [];
  let tokens = [];
  for (let token of trimmedCommand.split(SPACES_REGEXP)) {
    let previousToken = tokens.at(-1);
    if (previousToken && previousToken.endsWith("\\"))
      tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
    else
      tokens.push(token);
  }
  return tokens;
}, SPACES_REGEXP;
