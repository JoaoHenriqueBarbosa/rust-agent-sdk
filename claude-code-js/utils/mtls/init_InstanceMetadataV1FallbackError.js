// var: init_InstanceMetadataV1FallbackError
var init_InstanceMetadataV1FallbackError = __esm(() => {
  import_property_provider4 = __toESM(require_dist_cjs6(), 1);
  InstanceMetadataV1FallbackError = class InstanceMetadataV1FallbackError extends import_property_provider4.CredentialsProviderError {
    tryNextLink;
    name = "InstanceMetadataV1FallbackError";
    constructor(message, tryNextLink = !0) {
      super(message, tryNextLink);
      this.tryNextLink = tryNextLink, Object.setPrototypeOf(this, InstanceMetadataV1FallbackError.prototype);
    }
  };
});
