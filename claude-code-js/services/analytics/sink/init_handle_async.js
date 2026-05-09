// var: init_handle_async
var init_handle_async = __esm(() => {
  init_generator();
  init_handle();
  init_type();
  addProperties2 = {
    fileNumber: forbiddenIfAsync,
    generator: generatorToStream,
    asyncGenerator: generatorToStream,
    nodeStream: ({ value }) => ({ stream: value }),
    webTransform({ value: { transform: transform2, writableObjectMode, readableObjectMode } }) {
      let objectMode = writableObjectMode || readableObjectMode;
      return { stream: Duplex2.fromWeb(transform2, { objectMode }) };
    },
    duplex: ({ value: { transform: transform2 } }) => ({ stream: transform2 }),
    native() {}
  }, addPropertiesAsync = {
    input: {
      ...addProperties2,
      fileUrl: ({ value }) => ({ stream: createReadStream(value) }),
      filePath: ({ value: { file: file2 } }) => ({ stream: createReadStream(file2) }),
      webStream: ({ value }) => ({ stream: Readable2.fromWeb(value) }),
      iterable: ({ value }) => ({ stream: Readable2.from(value) }),
      asyncIterable: ({ value }) => ({ stream: Readable2.from(value) }),
      string: ({ value }) => ({ stream: Readable2.from(value) }),
      uint8Array: ({ value }) => ({ stream: Readable2.from(Buffer6.from(value)) })
    },
    output: {
      ...addProperties2,
      fileUrl: ({ value }) => ({ stream: createWriteStream2(value) }),
      filePath: ({ value: { file: file2, append } }) => ({ stream: createWriteStream2(file2, append ? { flags: "a" } : {}) }),
      webStream: ({ value }) => ({ stream: Writable2.fromWeb(value) }),
      iterable: forbiddenIfAsync,
      asyncIterable: forbiddenIfAsync,
      string: forbiddenIfAsync,
      uint8Array: forbiddenIfAsync
    }
  };
});
