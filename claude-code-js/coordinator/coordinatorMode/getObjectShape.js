// function: getObjectShape
function getObjectShape(schema5) {
  if (!schema5)
    return;
  let rawShape;
  if (isZ4Schema(schema5))
    rawShape = schema5._zod?.def?.shape;
  else
    rawShape = schema5.shape;
  if (!rawShape)
    return;
  if (typeof rawShape === "function")
    try {
      return rawShape();
    } catch {
      return;
    }
  return rawShape;
}
