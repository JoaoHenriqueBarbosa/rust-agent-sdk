// Original: src/components/ClickableImageRef.tsx
import { pathToFileURL } from "url";
function ClickableImageRef(t0) {
  let $3 = import_compiler_runtime43.c(13), {
    imageId,
    backgroundColor,
    isSelected: t1
  } = t0, isSelected = t1 === void 0 ? !1 : t1, imagePath = getStoredImagePath(imageId), displayText = `[Image #${imageId}]`;
  if (imagePath && supportsHyperlinks()) {
    let fileUrl = pathToFileURL(imagePath).href, t22, t3;
    if ($3[0] !== backgroundColor || $3[1] !== displayText || $3[2] !== isSelected)
      t22 = /* @__PURE__ */ jsx_dev_runtime49.jsxDEV(ThemedText, {
        backgroundColor,
        inverse: isSelected,
        children: displayText
      }, void 0, !1, void 0, this), t3 = /* @__PURE__ */ jsx_dev_runtime49.jsxDEV(ThemedText, {
        backgroundColor,
        inverse: isSelected,
        bold: isSelected,
        children: displayText
      }, void 0, !1, void 0, this), $3[0] = backgroundColor, $3[1] = displayText, $3[2] = isSelected, $3[3] = t22, $3[4] = t3;
    else
      t22 = $3[3], t3 = $3[4];
    let t4;
    if ($3[5] !== fileUrl || $3[6] !== t22 || $3[7] !== t3)
      t4 = /* @__PURE__ */ jsx_dev_runtime49.jsxDEV(Link, {
        url: fileUrl,
        fallback: t22,
        children: t3
      }, void 0, !1, void 0, this), $3[5] = fileUrl, $3[6] = t22, $3[7] = t3, $3[8] = t4;
    else
      t4 = $3[8];
    return t4;
  }
  let t2;
  if ($3[9] !== backgroundColor || $3[10] !== displayText || $3[11] !== isSelected)
    t2 = /* @__PURE__ */ jsx_dev_runtime49.jsxDEV(ThemedText, {
      backgroundColor,
      inverse: isSelected,
      children: displayText
    }, void 0, !1, void 0, this), $3[9] = backgroundColor, $3[10] = displayText, $3[11] = isSelected, $3[12] = t2;
  else
    t2 = $3[12];
  return t2;
}
var import_compiler_runtime43, jsx_dev_runtime49;
var init_ClickableImageRef = __esm(() => {
  init_Link();
  init_supports_hyperlinks();
  init_ink2();
  init_imageStore();
  import_compiler_runtime43 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime49 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
