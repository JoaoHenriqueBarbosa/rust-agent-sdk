// var: init_direction
var init_direction = __esm(() => {
  init_type();
  KNOWN_DIRECTIONS = ["input", "output", "output"], guessStreamDirection = {
    generator: anyDirection,
    asyncGenerator: anyDirection,
    fileUrl: anyDirection,
    filePath: anyDirection,
    iterable: alwaysInput,
    asyncIterable: alwaysInput,
    uint8Array: alwaysInput,
    webStream: (value) => isWritableStream2(value) ? "output" : "input",
    nodeStream(value) {
      if (!isReadableStream(value, { checkOpen: !1 }))
        return "output";
      return isWritableStream(value, { checkOpen: !1 }) ? void 0 : "input";
    },
    webTransform: anyDirection,
    duplex: anyDirection,
    native(value) {
      let standardStreamDirection = getStandardStreamDirection(value);
      if (standardStreamDirection !== void 0)
        return standardStreamDirection;
      if (isStream(value, { checkOpen: !1 }))
        return guessStreamDirection.nodeStream(value);
    }
  };
});
