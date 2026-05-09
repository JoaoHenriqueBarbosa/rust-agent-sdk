// function: preprocess
function preprocess(fn, schema) {
  return pipe(transform(fn), schema);
}
