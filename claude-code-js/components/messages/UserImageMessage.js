// Original: src/components/messages/UserImageMessage.tsx
import { pathToFileURL as pathToFileURL2 } from "url";
function UserImageMessage(t0) {
  let $3 = import_compiler_runtime88.c(7), {
    imageId,
    addMargin
  } = t0, label = imageId ? `[Image #${imageId}]` : "[Image]", t1;
  if ($3[0] !== imageId || $3[1] !== label) {
    let imagePath = imageId ? getStoredImagePath(imageId) : null;
    t1 = imagePath && supportsHyperlinks() ? /* @__PURE__ */ jsx_dev_runtime99.jsxDEV(Link, {
      url: pathToFileURL2(imagePath).href,
      children: /* @__PURE__ */ jsx_dev_runtime99.jsxDEV(ThemedText, {
        children: label
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime99.jsxDEV(ThemedText, {
      children: label
    }, void 0, !1, void 0, this), $3[0] = imageId, $3[1] = label, $3[2] = t1;
  } else
    t1 = $3[2];
  let content = t1;
  if (addMargin) {
    let t22;
    if ($3[3] !== content)
      t22 = /* @__PURE__ */ jsx_dev_runtime99.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: content
      }, void 0, !1, void 0, this), $3[3] = content, $3[4] = t22;
    else
      t22 = $3[4];
    return t22;
  }
  let t2;
  if ($3[5] !== content)
    t2 = /* @__PURE__ */ jsx_dev_runtime99.jsxDEV(MessageResponse, {
      children: content
    }, void 0, !1, void 0, this), $3[5] = content, $3[6] = t2;
  else
    t2 = $3[6];
  return t2;
}
var import_compiler_runtime88, jsx_dev_runtime99;
var init_UserImageMessage = __esm(() => {
  init_Link();
  init_supports_hyperlinks();
  init_ink2();
  init_imageStore();
  init_MessageResponse();
  import_compiler_runtime88 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime99 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
