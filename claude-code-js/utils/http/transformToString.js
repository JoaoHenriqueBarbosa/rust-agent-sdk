// function: transformToString
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64")
    return toBase647(payload);
  return toUtf87(payload);
}
