// function: stripModulePrefix
function stripModulePrefix(name3) {
  let idx = name3.lastIndexOf("\\");
  if (idx < 0)
    return name3;
  if (/^[A-Za-z]:/.test(name3) || name3.startsWith("\\\\") || name3.startsWith(".\\") || name3.startsWith("..\\"))
    return name3;
  return name3.substring(idx + 1);
}
