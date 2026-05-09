// function: createImageResponse
function createImageResponse(buffer, mediaType, originalSize, dimensions) {
  return {
    type: "image",
    file: {
      base64: buffer.toString("base64"),
      type: `image/${mediaType}`,
      originalSize,
      dimensions
    }
  };
}
