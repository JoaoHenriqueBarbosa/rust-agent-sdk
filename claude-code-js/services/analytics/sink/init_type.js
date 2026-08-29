// var: init_type
var init_type = __esm(() => {
  init_uint_array();
  FILE_PATH_KEYS = /* @__PURE__ */ new Set(["file", "append"]), KNOWN_STDIO_STRINGS = /* @__PURE__ */ new Set(["ipc", "ignore", "inherit", "overlapped", "pipe"]), TRANSFORM_TYPES = /* @__PURE__ */ new Set(["generator", "asyncGenerator", "duplex", "webTransform"]), FILE_TYPES = /* @__PURE__ */ new Set(["fileUrl", "filePath", "fileNumber"]), SPECIAL_DUPLICATE_TYPES_SYNC = /* @__PURE__ */ new Set(["fileUrl", "filePath"]), SPECIAL_DUPLICATE_TYPES = /* @__PURE__ */ new Set([...SPECIAL_DUPLICATE_TYPES_SYNC, "webStream", "nodeStream"]), FORBID_DUPLICATE_TYPES = /* @__PURE__ */ new Set(["webTransform", "duplex"]), TYPE_TO_MESSAGE = {
    generator: "a generator",
    asyncGenerator: "an async generator",
    fileUrl: "a file URL",
    filePath: "a file path string",
    fileNumber: "a file descriptor number",
    webStream: "a web stream",
    nodeStream: "a Node.js stream",
    webTransform: "a web TransformStream",
    duplex: "a Duplex stream",
    native: "any value",
    iterable: "an iterable",
    asyncIterable: "an async iterable",
    string: "a string",
    uint8Array: "a Uint8Array"
  };
});
