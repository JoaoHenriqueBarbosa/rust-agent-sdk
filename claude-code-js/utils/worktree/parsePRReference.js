// function: parsePRReference
function parsePRReference(input) {
  let urlMatch = input.match(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/pull\/(\d+)\/?(?:[?#].*)?$/i);
  if (urlMatch?.[1])
    return parseInt(urlMatch[1], 10);
  let hashMatch = input.match(/^#(\d+)$/);
  if (hashMatch?.[1])
    return parseInt(hashMatch[1], 10);
  return null;
}
