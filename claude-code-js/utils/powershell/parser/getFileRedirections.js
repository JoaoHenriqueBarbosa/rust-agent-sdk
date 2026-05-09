// function: getFileRedirections
function getFileRedirections(parsed) {
  return getAllRedirections(parsed).filter((r4) => !r4.isMerging && !isNullRedirectionTarget(r4.target));
}
