// Original: src/tools/FileReadTool/imageProcessor.ts
async function getImageProcessor() {
  if (imageProcessorModule)
    return imageProcessorModule.default;
  if (isInBundledMode())
    try {
      let imageProcessor = await import("image-processor-napi"), sharp2 = imageProcessor.sharp || imageProcessor.default;
      return imageProcessorModule = { default: sharp2 }, sharp2;
    } catch {
      console.warn("Native image processor not available, falling back to sharp");
    }
  let imported = await import("sharp"), sharp = unwrapDefault(imported);
  return imageProcessorModule = { default: sharp }, sharp;
}
function unwrapDefault(mod) {
  return typeof mod === "function" ? mod : mod.default;
}
var imageProcessorModule = null;
var init_imageProcessor = () => {};
