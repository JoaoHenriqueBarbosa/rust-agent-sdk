// Original: src/utils/imageValidation.ts
function isBase64ImageBlock(block2) {
  if (typeof block2 !== "object" || block2 === null)
    return !1;
  let b = block2;
  if (b.type !== "image")
    return !1;
  if (typeof b.source !== "object" || b.source === null)
    return !1;
  let source = b.source;
  return source.type === "base64" && typeof source.data === "string";
}
function validateImagesForAPI(messages) {
  let oversizedImages = [], imageIndex = 0;
  for (let msg of messages) {
    if (typeof msg !== "object" || msg === null)
      continue;
    let m4 = msg;
    if (m4.type !== "user")
      continue;
    let innerMessage = m4.message;
    if (!innerMessage)
      continue;
    let content = innerMessage.content;
    if (typeof content === "string" || !Array.isArray(content))
      continue;
    for (let block2 of content)
      if (isBase64ImageBlock(block2)) {
        imageIndex++;
        let base64Size = block2.source.data.length;
        if (base64Size > API_IMAGE_MAX_BASE64_SIZE)
          logEvent("tengu_image_api_validation_failed", {
            base64_size_bytes: base64Size,
            max_bytes: API_IMAGE_MAX_BASE64_SIZE
          }), oversizedImages.push({ index: imageIndex, size: base64Size });
      }
  }
  if (oversizedImages.length > 0)
    throw new ImageSizeError(oversizedImages, API_IMAGE_MAX_BASE64_SIZE);
}
var ImageSizeError;
var init_imageValidation = __esm(() => {
  init_format();
  ImageSizeError = class ImageSizeError extends Error {
    constructor(oversizedImages, maxSize) {
      let message, firstImage = oversizedImages[0];
      if (oversizedImages.length === 1 && firstImage)
        message = `Image base64 size (${formatFileSize(firstImage.size)}) exceeds API limit (${formatFileSize(maxSize)}). Please resize the image before sending.`;
      else
        message = `${oversizedImages.length} images exceed the API limit (${formatFileSize(maxSize)}): ` + oversizedImages.map((img) => `Image ${img.index}: ${formatFileSize(img.size)}`).join(", ") + ". Please resize these images before sending.";
      super(message);
      this.name = "ImageSizeError";
    }
  };
});
