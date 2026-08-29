// function: buildImageContentBlocks
async function buildImageContentBlocks(pastedContents) {
  if (!pastedContents)
    return [];
  let imageContents = Object.values(pastedContents).filter(isValidImagePaste);
  if (imageContents.length === 0)
    return [];
  return await Promise.all(imageContents.map(async (img) => {
    let imageBlock = {
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType || "image/png",
        data: img.content
      }
    };
    return (await maybeResizeAndDownsampleImageBlock(imageBlock)).block;
  }));
}
