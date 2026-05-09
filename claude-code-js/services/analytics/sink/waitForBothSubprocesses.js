// var: waitForBothSubprocesses
var waitForBothSubprocesses = async (subprocessPromises) => {
  let [
    { status: sourceStatus, reason: sourceReason, value: sourceResult = sourceReason },
    { status: destinationStatus, reason: destinationReason, value: destinationResult = destinationReason }
  ] = await subprocessPromises;
  if (!destinationResult.pipedFrom.includes(sourceResult))
    destinationResult.pipedFrom.push(sourceResult);
  if (destinationStatus === "rejected")
    throw destinationResult;
  if (sourceStatus === "rejected")
    throw sourceResult;
  return destinationResult;
};
