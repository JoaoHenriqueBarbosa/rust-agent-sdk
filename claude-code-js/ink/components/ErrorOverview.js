// Original: src/ink/components/ErrorOverview.tsx
import { readFileSync as readFileSync10 } from "fs";
function getStackUtils() {
  return stackUtils ??= new import_stack_utils.default({
    cwd: process.cwd(),
    internals: import_stack_utils.default.nodeInternals()
  });
}
function ErrorOverview({
  error: error44
}) {
  let stack = error44.stack ? error44.stack.split(`
`).slice(1) : void 0, origin2 = stack ? getStackUtils().parseLine(stack[0]) : void 0, filePath = cleanupPath(origin2?.file), excerpt, lineWidth2 = 0;
  if (filePath && origin2?.line)
    try {
      let sourceCode = readFileSync10(filePath, "utf8");
      if (excerpt = dist_default2(sourceCode, origin2.line), excerpt)
        for (let {
          line
        } of excerpt)
          lineWidth2 = Math.max(lineWidth2, String(line).length);
    } catch {}
  return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
    flexDirection: "column",
    padding: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
            backgroundColor: "ansi:red",
            color: "ansi:white",
            children: [
              " ",
              "ERROR",
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
            children: [
              " ",
              error44.message
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      origin2 && filePath && /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
          dim: !0,
          children: [
            filePath,
            ":",
            origin2.line,
            ":",
            origin2.column
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      origin2 && excerpt && /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
        marginTop: 1,
        flexDirection: "column",
        children: excerpt.map(({
          line: line_0,
          value
        }) => /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
              width: lineWidth2 + 1,
              children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                dim: line_0 !== origin2.line,
                backgroundColor: line_0 === origin2.line ? "ansi:red" : void 0,
                color: line_0 === origin2.line ? "ansi:white" : void 0,
                children: [
                  String(line_0).padStart(lineWidth2, " "),
                  ":"
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
              backgroundColor: line_0 === origin2.line ? "ansi:red" : void 0,
              color: line_0 === origin2.line ? "ansi:white" : void 0,
              children: " " + value
            }, line_0, !1, void 0, this)
          ]
        }, line_0, !0, void 0, this))
      }, void 0, !1, void 0, this),
      error44.stack && /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
        marginTop: 1,
        flexDirection: "column",
        children: error44.stack.split(`
`).slice(1).map((line_1) => {
          let parsedLine = getStackUtils().parseLine(line_1);
          if (!parsedLine)
            return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                  dim: !0,
                  children: "- "
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                  bold: !0,
                  children: line_1
                }, void 0, !1, void 0, this)
              ]
            }, line_1, !0, void 0, this);
          return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Box_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                dim: !0,
                children: "- "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                bold: !0,
                children: parsedLine.function
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Text, {
                dim: !0,
                children: [
                  " ",
                  "(",
                  cleanupPath(parsedLine.file) ?? "",
                  ":",
                  parsedLine.line,
                  ":",
                  parsedLine.column,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, line_1, !0, void 0, this);
        })
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_stack_utils, jsx_dev_runtime6, cleanupPath = (path12) => {
  return path12?.replace(`file://${process.cwd()}/`, "");
}, stackUtils;
var init_ErrorOverview = __esm(() => {
  init_dist3();
  init_Box();
  init_Text();
  import_stack_utils = __toESM(require_stack_utils(), 1), jsx_dev_runtime6 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
