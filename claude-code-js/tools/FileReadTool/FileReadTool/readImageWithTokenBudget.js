// function: readImageWithTokenBudget
async function readImageWithTokenBudget(filePath, maxTokens = getDefaultFileReadingLimits().maxTokens, maxBytes) {
  let imageBuffer = await getFsImplementation().readFileBytes(filePath, maxBytes), originalSize = imageBuffer.length;
  if (originalSize === 0)
    throw Error(`Image file is empty: ${filePath}`);
  let detectedMediaType = detectImageFormatFromBuffer(imageBuffer), detectedFormat = detectedMediaType.split("/")[1] || "png", result;
  try {
    let resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, originalSize, detectedFormat);
    result = createImageResponse(resized.buffer, resized.mediaType, originalSize, resized.dimensions);
  } catch (e) {
    if (e instanceof ImageResizeError)
      throw e;
    logError2(e), result = createImageResponse(imageBuffer, detectedFormat, originalSize);
  }
  if (Math.ceil(result.file.base64.length * 0.125) > maxTokens)
    try {
      let compressed = await compressImageBufferWithTokenLimit(imageBuffer, maxTokens, detectedMediaType);
      return {
        type: "image",
        file: {
          base64: compressed.base64,
          type: compressed.mediaType,
          originalSize
        }
      };
    } catch (e) {
      logError2(e);
      try {
        let sharpModule = await import("sharp"), fallbackBuffer = await (sharpModule.default || sharpModule)(imageBuffer).resize(400, 400, {
          fit: "inside",
          withoutEnlargement: !0
        }).jpeg({ quality: 20 }).toBuffer();
        return createImageResponse(fallbackBuffer, "jpeg", originalSize);
      } catch (error44) {
        return logError2(error44), createImageResponse(imageBuffer, detectedFormat, originalSize);
      }
    }
  return result;
}
