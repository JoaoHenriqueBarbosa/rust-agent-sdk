// var: init_handle_sync
var init_handle_sync = __esm(() => {
  init_uint_array();
  init_handle();
  init_type();
  addProperties = {
    generator() {},
    asyncGenerator: forbiddenIfSync,
    webStream: forbiddenIfSync,
    nodeStream: forbiddenIfSync,
    webTransform: forbiddenIfSync,
    duplex: forbiddenIfSync,
    asyncIterable: forbiddenIfSync,
    native: forbiddenNativeIfSync
  }, addPropertiesSync = {
    input: {
      ...addProperties,
      fileUrl: ({ value }) => ({ contents: [bufferToUint8Array(readFileSync3(value))] }),
      filePath: ({ value: { file: file2 } }) => ({ contents: [bufferToUint8Array(readFileSync3(file2))] }),
      fileNumber: forbiddenIfSync,
      iterable: ({ value }) => ({ contents: [...value] }),
      string: ({ value }) => ({ contents: [value] }),
      uint8Array: ({ value }) => ({ contents: [value] })
    },
    output: {
      ...addProperties,
      fileUrl: ({ value }) => ({ path: value }),
      filePath: ({ value: { file: file2, append } }) => ({ path: file2, append }),
      fileNumber: ({ value }) => ({ path: value }),
      iterable: forbiddenIfSync,
      string: forbiddenIfSync,
      uint8Array: forbiddenIfSync
    }
  };
});
