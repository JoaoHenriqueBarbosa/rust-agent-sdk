// function: sample
function sample(collection) {
  var func = isArray_default(collection) ? _arraySample_default : _baseSample_default;
  return func(collection);
}
