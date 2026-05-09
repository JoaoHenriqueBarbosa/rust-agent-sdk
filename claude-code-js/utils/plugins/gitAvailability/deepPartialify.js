// function: deepPartialify
function deepPartialify(schema5) {
  if (schema5 instanceof ZodObject2) {
    let newShape = {};
    for (let key in schema5.shape) {
      let fieldSchema = schema5.shape[key];
      newShape[key] = ZodOptional2.create(deepPartialify(fieldSchema));
    }
    return new ZodObject2({
      ...schema5._def,
      shape: () => newShape
    });
  } else if (schema5 instanceof ZodArray2)
    return new ZodArray2({
      ...schema5._def,
      type: deepPartialify(schema5.element)
    });
  else if (schema5 instanceof ZodOptional2)
    return ZodOptional2.create(deepPartialify(schema5.unwrap()));
  else if (schema5 instanceof ZodNullable2)
    return ZodNullable2.create(deepPartialify(schema5.unwrap()));
  else if (schema5 instanceof ZodTuple2)
    return ZodTuple2.create(schema5.items.map((item) => deepPartialify(item)));
  else
    return schema5;
}
