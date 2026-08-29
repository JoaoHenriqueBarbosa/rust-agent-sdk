// function: assertValidBoundary
function assertValidBoundary(boundary) {
  if (boundary.length > maxBoundaryLength)
    throw Error(`Multipart boundary "${boundary}" exceeds maximum length of 70 characters`);
  if (Array.from(boundary).some((x3) => !validBoundaryCharacters.has(x3)))
    throw Error(`Multipart boundary "${boundary}" contains invalid characters`);
}
