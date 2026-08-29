// Original: src/utils/imageResizer.ts
function classifyImageError(error44) {
  if (error44 instanceof Error) {
    let errorWithCode = error44;
    if (errorWithCode.code === "MODULE_NOT_FOUND" || errorWithCode.code === "ERR_MODULE_NOT_FOUND" || errorWithCode.code === "ERR_DLOPEN_FAILED")
      return ERROR_TYPE_MODULE_LOAD;
    if (errorWithCode.code === "EACCES" || errorWithCode.code === "EPERM")
      return ERROR_TYPE_PERMISSION;
    if (errorWithCode.code === "ENOMEM")
      return ERROR_TYPE_MEMORY;
  }
  let message = errorMessage(error44);
  if (message.includes("Native image processor module not available"))
    return ERROR_TYPE_MODULE_LOAD;
  if (message.includes("unsupported image format") || message.includes("Input buffer") || message.includes("Input file is missing") || message.includes("Input file has corrupt header") || message.includes("corrupt header") || message.includes("corrupt image") || message.includes("premature end") || message.includes("zlib: data error") || message.includes("zero width") || message.includes("zero height"))
    return ERROR_TYPE_PROCESSING;
  if (message.includes("pixel limit") || message.includes("too many pixels") || message.includes("exceeds pixel") || message.includes("image dimensions"))
    return ERROR_TYPE_PIXEL_LIMIT;
  if (message.includes("out of memory") || message.includes("Cannot allocate") || message.includes("memory allocation"))
    return ERROR_TYPE_MEMORY;
  if (message.includes("timeout") || message.includes("timed out"))
    return ERROR_TYPE_TIMEOUT;
  if (message.includes("Vips"))
    return ERROR_TYPE_VIPS;
  return ERROR_TYPE_UNKNOWN;
}
function hashString(str) {
  let hash = 5381;
  for (let i5 = 0;i5 < str.length; i5++)
    hash = (hash << 5) + hash + str.charCodeAt(i5) | 0;
  return hash >>> 0;
}
async function maybeResizeAndDownsampleImageBuffer(imageBuffer, originalSize, ext) {
  if (imageBuffer.length === 0)
    throw new ImageResizeError("Image file is empty (0 bytes)");
  try {
    let sharp = await getImageProcessor(), metadata = await sharp(imageBuffer).metadata(), mediaType = metadata.format ?? ext, normalizedMediaType = mediaType === "jpg" ? "jpeg" : mediaType;
    if (!metadata.width || !metadata.height) {
      if (originalSize > IMAGE_TARGET_RAW_SIZE)
        return { buffer: await sharp(imageBuffer).jpeg({ quality: 80 }).toBuffer(), mediaType: "jpeg" };
      return { buffer: imageBuffer, mediaType: normalizedMediaType };
    }
    let { width: originalWidth, height: originalHeight } = metadata, width = originalWidth, height2 = originalHeight;
    if (originalSize <= IMAGE_TARGET_RAW_SIZE && width <= IMAGE_MAX_WIDTH && height2 <= IMAGE_MAX_HEIGHT)
      return {
        buffer: imageBuffer,
        mediaType: normalizedMediaType,
        dimensions: {
          originalWidth,
          originalHeight,
          displayWidth: width,
          displayHeight: height2
        }
      };
    let needsDimensionResize = width > IMAGE_MAX_WIDTH || height2 > IMAGE_MAX_HEIGHT, isPng = normalizedMediaType === "png";
    if (!needsDimensionResize && originalSize > IMAGE_TARGET_RAW_SIZE) {
      if (isPng) {
        let pngCompressed = await sharp(imageBuffer).png({ compressionLevel: 9, palette: !0 }).toBuffer();
        if (pngCompressed.length <= IMAGE_TARGET_RAW_SIZE)
          return {
            buffer: pngCompressed,
            mediaType: "png",
            dimensions: {
              originalWidth,
              originalHeight,
              displayWidth: width,
              displayHeight: height2
            }
          };
      }
      for (let quality of [80, 60, 40, 20]) {
        let compressedBuffer = await sharp(imageBuffer).jpeg({ quality }).toBuffer();
        if (compressedBuffer.length <= IMAGE_TARGET_RAW_SIZE)
          return {
            buffer: compressedBuffer,
            mediaType: "jpeg",
            dimensions: {
              originalWidth,
              originalHeight,
              displayWidth: width,
              displayHeight: height2
            }
          };
      }
    }
    if (width > IMAGE_MAX_WIDTH)
      height2 = Math.round(height2 * IMAGE_MAX_WIDTH / width), width = IMAGE_MAX_WIDTH;
    if (height2 > IMAGE_MAX_HEIGHT)
      width = Math.round(width * IMAGE_MAX_HEIGHT / height2), height2 = IMAGE_MAX_HEIGHT;
    logForDebugging(`Resizing to ${width}x${height2}`);
    let resizedImageBuffer = await sharp(imageBuffer).resize(width, height2, {
      fit: "inside",
      withoutEnlargement: !0
    }).toBuffer();
    if (resizedImageBuffer.length > IMAGE_TARGET_RAW_SIZE) {
      if (isPng) {
        let pngCompressed = await sharp(imageBuffer).resize(width, height2, {
          fit: "inside",
          withoutEnlargement: !0
        }).png({ compressionLevel: 9, palette: !0 }).toBuffer();
        if (pngCompressed.length <= IMAGE_TARGET_RAW_SIZE)
          return {
            buffer: pngCompressed,
            mediaType: "png",
            dimensions: {
              originalWidth,
              originalHeight,
              displayWidth: width,
              displayHeight: height2
            }
          };
      }
      for (let quality of [80, 60, 40, 20]) {
        let compressedBuffer2 = await sharp(imageBuffer).resize(width, height2, {
          fit: "inside",
          withoutEnlargement: !0
        }).jpeg({ quality }).toBuffer();
        if (compressedBuffer2.length <= IMAGE_TARGET_RAW_SIZE)
          return {
            buffer: compressedBuffer2,
            mediaType: "jpeg",
            dimensions: {
              originalWidth,
              originalHeight,
              displayWidth: width,
              displayHeight: height2
            }
          };
      }
      let smallerWidth = Math.min(width, 1000), smallerHeight = Math.round(height2 * smallerWidth / Math.max(width, 1));
      logForDebugging("Still too large, compressing with JPEG");
      let compressedBuffer = await sharp(imageBuffer).resize(smallerWidth, smallerHeight, {
        fit: "inside",
        withoutEnlargement: !0
      }).jpeg({ quality: 20 }).toBuffer();
      return logForDebugging(`JPEG compressed buffer size: ${compressedBuffer.length}`), {
        buffer: compressedBuffer,
        mediaType: "jpeg",
        dimensions: {
          originalWidth,
          originalHeight,
          displayWidth: smallerWidth,
          displayHeight: smallerHeight
        }
      };
    }
    return {
      buffer: resizedImageBuffer,
      mediaType: normalizedMediaType,
      dimensions: {
        originalWidth,
        originalHeight,
        displayWidth: width,
        displayHeight: height2
      }
    };
  } catch (error44) {
    logError2(error44);
    let errorType = classifyImageError(error44), errorMsg = errorMessage(error44);
    logEvent("tengu_image_resize_failed", {
      original_size_bytes: originalSize,
      error_type: errorType,
      error_message_hash: hashString(errorMsg)
    });
    let normalizedExt = detectImageFormatFromBuffer(imageBuffer).slice(6), base64Size = Math.ceil(originalSize * 4 / 3), overDim = imageBuffer.length >= 24 && imageBuffer[0] === 137 && imageBuffer[1] === 80 && imageBuffer[2] === 78 && imageBuffer[3] === 71 && (imageBuffer.readUInt32BE(16) > IMAGE_MAX_WIDTH || imageBuffer.readUInt32BE(20) > IMAGE_MAX_HEIGHT);
    if (base64Size <= API_IMAGE_MAX_BASE64_SIZE && !overDim)
      return logEvent("tengu_image_resize_fallback", {
        original_size_bytes: originalSize,
        base64_size_bytes: base64Size,
        error_type: errorType
      }), { buffer: imageBuffer, mediaType: normalizedExt };
    throw new ImageResizeError(overDim ? `Unable to resize image \u2014 dimensions exceed the ${IMAGE_MAX_WIDTH}x${IMAGE_MAX_HEIGHT}px limit and image processing failed. Please resize the image to reduce its pixel dimensions.` : `Unable to resize image (${formatFileSize(originalSize)} raw, ${formatFileSize(base64Size)} base64). The image exceeds the 5MB API limit and compression failed. Please resize the image manually or use a smaller image.`);
  }
}
async function maybeResizeAndDownsampleImageBlock(imageBlock) {
  if (imageBlock.source.type !== "base64")
    return { block: imageBlock };
  let imageBuffer = Buffer.from(imageBlock.source.data, "base64"), originalSize = imageBuffer.length, ext = imageBlock.source.media_type?.split("/")[1] || "png", resized = await maybeResizeAndDownsampleImageBuffer(imageBuffer, originalSize, ext);
  return {
    block: {
      type: "image",
      source: {
        type: "base64",
        media_type: `image/${resized.mediaType}`,
        data: resized.buffer.toString("base64")
      }
    },
    dimensions: resized.dimensions
  };
}
async function compressImageBuffer(imageBuffer, maxBytes = IMAGE_TARGET_RAW_SIZE, originalMediaType) {
  let fallbackFormat = originalMediaType?.split("/")[1] || "jpeg", normalizedFallback = fallbackFormat === "jpg" ? "jpeg" : fallbackFormat;
  try {
    let sharp = await getImageProcessor(), metadata = await sharp(imageBuffer).metadata(), format4 = metadata.format || normalizedFallback, originalSize = imageBuffer.length, context3 = {
      imageBuffer,
      metadata,
      format: format4,
      maxBytes,
      originalSize
    };
    if (originalSize <= maxBytes)
      return createCompressedImageResult(imageBuffer, format4, originalSize);
    let resizedResult = await tryProgressiveResizing(context3, sharp);
    if (resizedResult)
      return resizedResult;
    if (format4 === "png") {
      let palettizedResult = await tryPalettePNG(context3, sharp);
      if (palettizedResult)
        return palettizedResult;
    }
    let jpegResult = await tryJPEGConversion(context3, 50, sharp);
    if (jpegResult)
      return jpegResult;
    return await createUltraCompressedJPEG(context3, sharp);
  } catch (error44) {
    logError2(error44);
    let errorType = classifyImageError(error44), errorMsg = errorMessage(error44);
    if (logEvent("tengu_image_compress_failed", {
      original_size_bytes: imageBuffer.length,
      max_bytes: maxBytes,
      error_type: errorType,
      error_message_hash: hashString(errorMsg)
    }), imageBuffer.length <= maxBytes) {
      let detected = detectImageFormatFromBuffer(imageBuffer);
      return {
        base64: imageBuffer.toString("base64"),
        mediaType: detected,
        originalSize: imageBuffer.length
      };
    }
    throw new ImageResizeError(`Unable to compress image (${formatFileSize(imageBuffer.length)}) to fit within ${formatFileSize(maxBytes)}. Please use a smaller image.`);
  }
}
async function compressImageBufferWithTokenLimit(imageBuffer, maxTokens, originalMediaType) {
  let maxBase64Chars = Math.floor(maxTokens / 0.125), maxBytes = Math.floor(maxBase64Chars * 0.75);
  return compressImageBuffer(imageBuffer, maxBytes, originalMediaType);
}
async function compressImageBlock(imageBlock, maxBytes = IMAGE_TARGET_RAW_SIZE) {
  if (imageBlock.source.type !== "base64")
    return imageBlock;
  let imageBuffer = Buffer.from(imageBlock.source.data, "base64");
  if (imageBuffer.length <= maxBytes)
    return imageBlock;
  let compressed = await compressImageBuffer(imageBuffer, maxBytes);
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: compressed.mediaType,
      data: compressed.base64
    }
  };
}
function createCompressedImageResult(buffer, mediaType, originalSize) {
  let normalizedMediaType = mediaType === "jpg" ? "jpeg" : mediaType;
  return {
    base64: buffer.toString("base64"),
    mediaType: `image/${normalizedMediaType}`,
    originalSize
  };
}
async function tryProgressiveResizing(context3, sharp) {
  let scalingFactors = [1, 0.75, 0.5, 0.25];
  for (let scalingFactor of scalingFactors) {
    let newWidth = Math.round((context3.metadata.width || 2000) * scalingFactor), newHeight = Math.round((context3.metadata.height || 2000) * scalingFactor), resizedImage = sharp(context3.imageBuffer).resize(newWidth, newHeight, {
      fit: "inside",
      withoutEnlargement: !0
    });
    resizedImage = applyFormatOptimizations(resizedImage, context3.format);
    let resizedBuffer = await resizedImage.toBuffer();
    if (resizedBuffer.length <= context3.maxBytes)
      return createCompressedImageResult(resizedBuffer, context3.format, context3.originalSize);
  }
  return null;
}
function applyFormatOptimizations(image, format4) {
  switch (format4) {
    case "png":
      return image.png({
        compressionLevel: 9,
        palette: !0
      });
    case "jpeg":
    case "jpg":
      return image.jpeg({ quality: 80 });
    case "webp":
      return image.webp({ quality: 80 });
    default:
      return image;
  }
}
async function tryPalettePNG(context3, sharp) {
  let palettePng = await sharp(context3.imageBuffer).resize(800, 800, {
    fit: "inside",
    withoutEnlargement: !0
  }).png({
    compressionLevel: 9,
    palette: !0,
    colors: 64
  }).toBuffer();
  if (palettePng.length <= context3.maxBytes)
    return createCompressedImageResult(palettePng, "png", context3.originalSize);
  return null;
}
async function tryJPEGConversion(context3, quality, sharp) {
  let jpegBuffer = await sharp(context3.imageBuffer).resize(600, 600, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({ quality }).toBuffer();
  if (jpegBuffer.length <= context3.maxBytes)
    return createCompressedImageResult(jpegBuffer, "jpeg", context3.originalSize);
  return null;
}
async function createUltraCompressedJPEG(context3, sharp) {
  let ultraCompressedBuffer = await sharp(context3.imageBuffer).resize(400, 400, {
    fit: "inside",
    withoutEnlargement: !0
  }).jpeg({ quality: 20 }).toBuffer();
  return createCompressedImageResult(ultraCompressedBuffer, "jpeg", context3.originalSize);
}
function detectImageFormatFromBuffer(buffer) {
  if (buffer.length < 4)
    return "image/png";
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71)
    return "image/png";
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    return "image/jpeg";
  if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70)
    return "image/gif";
  if (buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70) {
    if (buffer.length >= 12 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80)
      return "image/webp";
  }
  return "image/png";
}
function detectImageFormatFromBase64(base64Data) {
  try {
    let buffer = Buffer.from(base64Data, "base64");
    return detectImageFormatFromBuffer(buffer);
  } catch {
    return "image/png";
  }
}
function createImageMetadataText(dims, sourcePath) {
  let { originalWidth, originalHeight, displayWidth, displayHeight } = dims;
  if (!originalWidth || !originalHeight || !displayWidth || !displayHeight || displayWidth <= 0 || displayHeight <= 0) {
    if (sourcePath)
      return `[Image source: ${sourcePath}]`;
    return null;
  }
  let wasResized = originalWidth !== displayWidth || originalHeight !== displayHeight;
  if (!wasResized && !sourcePath)
    return null;
  let parts = [];
  if (sourcePath)
    parts.push(`source: ${sourcePath}`);
  if (wasResized) {
    let scaleFactor = originalWidth / displayWidth;
    parts.push(`original ${originalWidth}x${originalHeight}, displayed at ${displayWidth}x${displayHeight}. Multiply coordinates by ${scaleFactor.toFixed(2)} to map to original image.`);
  }
  return `[Image: ${parts.join(", ")}]`;
}
var ERROR_TYPE_MODULE_LOAD = 1, ERROR_TYPE_PROCESSING = 2, ERROR_TYPE_UNKNOWN = 3, ERROR_TYPE_PIXEL_LIMIT = 4, ERROR_TYPE_MEMORY = 5, ERROR_TYPE_TIMEOUT = 6, ERROR_TYPE_VIPS = 7, ERROR_TYPE_PERMISSION = 8, ImageResizeError;
var init_imageResizer = __esm(() => {
  init_imageProcessor();
  init_debug();
  init_errors();
  init_format();
  init_log3();
  ImageResizeError = class ImageResizeError extends Error {
    constructor(message) {
      super(message);
      this.name = "ImageResizeError";
    }
  };
});
