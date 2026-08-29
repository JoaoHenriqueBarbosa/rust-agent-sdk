// function: safeParse3
function safeParse3(schema5, data) {
  if (isZ4Schema(schema5))
    return safeParse(schema5, data);
  return schema5.safeParse(data);
}
