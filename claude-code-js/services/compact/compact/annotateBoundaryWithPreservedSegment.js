// function: annotateBoundaryWithPreservedSegment
function annotateBoundaryWithPreservedSegment(boundary, anchorUuid, messagesToKeep) {
  let keep = messagesToKeep ?? [];
  if (keep.length === 0)
    return boundary;
  return {
    ...boundary,
    compactMetadata: {
      ...boundary.compactMetadata,
      preservedSegment: {
        headUuid: keep[0].uuid,
        anchorUuid,
        tailUuid: keep.at(-1).uuid
      }
    }
  };
}
