// function: readdirp
function readdirp(root2, options = {}) {
  let type = options.entryType || options.type;
  if (type === "both")
    type = EntryTypes.FILE_DIR_TYPE;
  if (type)
    options.type = type;
  if (!root2)
    throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
  else if (typeof root2 !== "string")
    throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
  else if (type && !ALL_TYPES.includes(type))
    throw Error(`readdirp: Invalid type passed. Use one of ${ALL_TYPES.join(", ")}`);
  return options.root = root2, new ReaddirpStream(options);
}
