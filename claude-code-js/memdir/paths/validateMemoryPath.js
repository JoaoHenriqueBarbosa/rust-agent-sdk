// function: validateMemoryPath
function validateMemoryPath(raw, expandTilde) {
  if (!raw)
    return;
  let candidate = raw;
  if (expandTilde && (candidate.startsWith("~/") || candidate.startsWith("~\\"))) {
    let rest = candidate.slice(2), restNorm = normalize3(rest || ".");
    if (restNorm === "." || restNorm === "..")
      return;
    candidate = join19(homedir10(), rest);
  }
  let normalized = normalize3(candidate).replace(/[/\\]+$/, "");
  if (!isAbsolute4(normalized) || normalized.length < 3 || /^[A-Za-z]:$/.test(normalized) || normalized.startsWith("\\\\") || normalized.startsWith("//") || normalized.includes("\x00"))
    return;
  return (normalized + sep4).normalize("NFC");
}
