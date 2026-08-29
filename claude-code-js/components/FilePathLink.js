// Original: src/components/FilePathLink.tsx
import { pathToFileURL as pathToFileURL3 } from "url";
function FilePathLink(t0) {
  let $3 = import_compiler_runtime89.c(5), {
    filePath,
    children
  } = t0, t1;
  if ($3[0] !== filePath)
    t1 = pathToFileURL3(filePath), $3[0] = filePath, $3[1] = t1;
  else
    t1 = $3[1];
  let t2 = children ?? filePath, t3;
  if ($3[2] !== t1.href || $3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime100.jsxDEV(Link, {
      url: t1.href,
      children: t2
    }, void 0, !1, void 0, this), $3[2] = t1.href, $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
var import_compiler_runtime89, jsx_dev_runtime100;
var init_FilePathLink = __esm(() => {
  init_Link();
  import_compiler_runtime89 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime100 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
