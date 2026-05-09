// var: addReference
var addReference = (channel, reference) => {
  if (reference)
    addReferenceCount(channel);
}, addReferenceCount = (channel) => {
  channel.refCounted();
}, removeReference = (channel, reference) => {
  if (reference)
    removeReferenceCount(channel);
}, removeReferenceCount = (channel) => {
  channel.unrefCounted();
}, undoAddedReferences = (channel, isSubprocess) => {
  if (isSubprocess)
    removeReferenceCount(channel), removeReferenceCount(channel);
}, redoAddedReferences = (channel, isSubprocess) => {
  if (isSubprocess)
    addReferenceCount(channel), addReferenceCount(channel);
};
