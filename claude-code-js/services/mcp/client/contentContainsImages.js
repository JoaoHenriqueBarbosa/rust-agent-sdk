// function: contentContainsImages
function contentContainsImages(content) {
  if (!content || typeof content === "string")
    return !1;
  return content.some((block2) => block2.type === "image");
}
