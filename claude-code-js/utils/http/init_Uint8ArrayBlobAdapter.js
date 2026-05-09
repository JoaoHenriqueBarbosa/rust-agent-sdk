// var: init_Uint8ArrayBlobAdapter
var init_Uint8ArrayBlobAdapter = __esm(() => {
  init_transforms();
  Uint8ArrayBlobAdapter = class Uint8ArrayBlobAdapter extends Uint8Array {
    static fromString(source, encoding = "utf-8") {
      switch (typeof source) {
        case "string":
          return transformFromString(source, encoding);
        default:
          throw Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
      }
    }
    static mutate(source) {
      return Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype), source;
    }
    transformToString(encoding = "utf-8") {
      return transformToString(this, encoding);
    }
  };
});
