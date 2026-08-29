// var: require_ResourceImpl
var require_ResourceImpl = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.defaultResource = exports.emptyResource = exports.resourceFromDetectedResource = exports.resourceFromAttributes = void 0;
  var api_1 = require_src7(), core_1 = require_src9(), semantic_conventions_1 = require_src8(), default_service_name_1 = require_default_service_name(), utils_1 = require_utils9();

  class ResourceImpl {
    _rawAttributes;
    _asyncAttributesPending = !1;
    _schemaUrl;
    _memoizedAttributes;
    static FromAttributeList(attributes, options2) {
      let res = new ResourceImpl({}, options2);
      return res._rawAttributes = guardedRawAttributes(attributes), res._asyncAttributesPending = attributes.filter(([_, val]) => (0, utils_1.isPromiseLike)(val)).length > 0, res;
    }
    constructor(resource, options2) {
      let attributes = resource.attributes ?? {};
      this._rawAttributes = Object.entries(attributes).map(([k3, v2]) => {
        if ((0, utils_1.isPromiseLike)(v2))
          this._asyncAttributesPending = !0;
        return [k3, v2];
      }), this._rawAttributes = guardedRawAttributes(this._rawAttributes), this._schemaUrl = validateSchemaUrl(options2?.schemaUrl);
    }
    get asyncAttributesPending() {
      return this._asyncAttributesPending;
    }
    async waitForAsyncAttributes() {
      if (!this.asyncAttributesPending)
        return;
      for (let i5 = 0;i5 < this._rawAttributes.length; i5++) {
        let [k3, v2] = this._rawAttributes[i5];
        this._rawAttributes[i5] = [k3, (0, utils_1.isPromiseLike)(v2) ? await v2 : v2];
      }
      this._asyncAttributesPending = !1;
    }
    get attributes() {
      if (this.asyncAttributesPending)
        api_1.diag.error("Accessing resource attributes before async attributes settled");
      if (this._memoizedAttributes)
        return this._memoizedAttributes;
      let attrs = {};
      for (let [k3, v2] of this._rawAttributes) {
        if ((0, utils_1.isPromiseLike)(v2)) {
          api_1.diag.debug(`Unsettled resource attribute ${k3} skipped`);
          continue;
        }
        if (v2 != null)
          attrs[k3] ??= v2;
      }
      if (!this._asyncAttributesPending)
        this._memoizedAttributes = attrs;
      return attrs;
    }
    getRawAttributes() {
      return this._rawAttributes;
    }
    get schemaUrl() {
      return this._schemaUrl;
    }
    merge(resource) {
      if (resource == null)
        return this;
      let mergedSchemaUrl = mergeSchemaUrl(this, resource), mergedOptions = mergedSchemaUrl ? { schemaUrl: mergedSchemaUrl } : void 0;
      return ResourceImpl.FromAttributeList([...resource.getRawAttributes(), ...this.getRawAttributes()], mergedOptions);
    }
  }
  function resourceFromAttributes(attributes, options2) {
    return ResourceImpl.FromAttributeList(Object.entries(attributes), options2);
  }
  exports.resourceFromAttributes = resourceFromAttributes;
  function resourceFromDetectedResource(detectedResource, options2) {
    return new ResourceImpl(detectedResource, options2);
  }
  exports.resourceFromDetectedResource = resourceFromDetectedResource;
  function emptyResource() {
    return resourceFromAttributes({});
  }
  exports.emptyResource = emptyResource;
  function defaultResource() {
    return resourceFromAttributes({
      [semantic_conventions_1.ATTR_SERVICE_NAME]: (0, default_service_name_1.defaultServiceName)(),
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE],
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME],
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]
    });
  }
  exports.defaultResource = defaultResource;
  function guardedRawAttributes(attributes) {
    return attributes.map(([k3, v2]) => {
      if ((0, utils_1.isPromiseLike)(v2))
        return [
          k3,
          v2.catch((err2) => {
            api_1.diag.debug("promise rejection for resource attribute: %s - %s", k3, err2);
            return;
          })
        ];
      return [k3, v2];
    });
  }
  function validateSchemaUrl(schemaUrl) {
    if (typeof schemaUrl === "string" || schemaUrl === void 0)
      return schemaUrl;
    api_1.diag.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", schemaUrl);
    return;
  }
  function mergeSchemaUrl(old, updating) {
    let oldSchemaUrl = old?.schemaUrl, updatingSchemaUrl = updating?.schemaUrl, isOldEmpty = oldSchemaUrl === void 0 || oldSchemaUrl === "", isUpdatingEmpty = updatingSchemaUrl === void 0 || updatingSchemaUrl === "";
    if (isOldEmpty)
      return updatingSchemaUrl;
    if (isUpdatingEmpty)
      return oldSchemaUrl;
    if (oldSchemaUrl === updatingSchemaUrl)
      return oldSchemaUrl;
    api_1.diag.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', oldSchemaUrl, updatingSchemaUrl);
    return;
  }
});
