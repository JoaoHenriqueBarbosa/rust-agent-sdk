// var: getTransformObjectModes
var getTransformObjectModes = (objectMode, index, newTransforms, direction) => direction === "output" ? getOutputObjectModes(objectMode, index, newTransforms) : getInputObjectModes(objectMode, index, newTransforms), getOutputObjectModes = (objectMode, index, newTransforms) => {
  let writableObjectMode = index !== 0 && newTransforms[index - 1].value.readableObjectMode;
  return { writableObjectMode, readableObjectMode: objectMode ?? writableObjectMode };
}, getInputObjectModes = (objectMode, index, newTransforms) => {
  let writableObjectMode = index === 0 ? objectMode === !0 : newTransforms[index - 1].value.readableObjectMode, readableObjectMode = index !== newTransforms.length - 1 && (objectMode ?? writableObjectMode);
  return { writableObjectMode, readableObjectMode };
}, getFdObjectMode = (stdioItems, direction) => {
  let lastTransform = stdioItems.findLast(({ type }) => TRANSFORM_TYPES.has(type));
  if (lastTransform === void 0)
    return !1;
  return direction === "input" ? lastTransform.value.writableObjectMode : lastTransform.value.readableObjectMode;
};
