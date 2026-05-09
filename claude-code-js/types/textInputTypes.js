// Original: src/types/textInputTypes.ts
function isValidImagePaste(c3) {
  return c3.type === "image" && c3.content.length > 0;
}
function getImagePasteIds(pastedContents) {
  if (!pastedContents)
    return;
  let ids = Object.values(pastedContents).filter(isValidImagePaste).map((c3) => c3.id);
  return ids.length > 0 ? ids : void 0;
}
