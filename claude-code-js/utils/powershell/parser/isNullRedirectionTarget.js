// function: isNullRedirectionTarget
function isNullRedirectionTarget(target) {
  let t2 = target.trim().toLowerCase();
  return t2 === "$null" || t2 === "${null}";
}
