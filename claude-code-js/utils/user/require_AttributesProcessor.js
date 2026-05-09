// var: require_AttributesProcessor
var require_AttributesProcessor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createDenyListAttributesProcessor = exports.createAllowListAttributesProcessor = exports.createMultiAttributesProcessor = exports.createNoopAttributesProcessor = void 0;

  class NoopAttributesProcessor {
    process(incoming, _context) {
      return incoming;
    }
  }

  class MultiAttributesProcessor {
    _processors;
    constructor(processors) {
      this._processors = processors;
    }
    process(incoming, context4) {
      let filteredAttributes = incoming;
      for (let processor of this._processors)
        filteredAttributes = processor.process(filteredAttributes, context4);
      return filteredAttributes;
    }
  }

  class AllowListProcessor {
    _allowedAttributeNames;
    constructor(allowedAttributeNames) {
      this._allowedAttributeNames = allowedAttributeNames;
    }
    process(incoming, _context) {
      let filteredAttributes = {};
      return Object.keys(incoming).forEach((attributeName) => {
        if (this._allowedAttributeNames.includes(attributeName))
          filteredAttributes[attributeName] = incoming[attributeName];
      }), filteredAttributes;
    }
  }

  class DenyListProcessor {
    _deniedAttributeNames;
    constructor(deniedAttributeNames) {
      this._deniedAttributeNames = deniedAttributeNames;
    }
    process(incoming, _context) {
      let filteredAttributes = {};
      return Object.keys(incoming).forEach((attributeName) => {
        if (!this._deniedAttributeNames.includes(attributeName))
          filteredAttributes[attributeName] = incoming[attributeName];
      }), filteredAttributes;
    }
  }
  function createNoopAttributesProcessor() {
    return NOOP;
  }
  exports.createNoopAttributesProcessor = createNoopAttributesProcessor;
  function createMultiAttributesProcessor(processors) {
    return new MultiAttributesProcessor(processors);
  }
  exports.createMultiAttributesProcessor = createMultiAttributesProcessor;
  function createAllowListAttributesProcessor(attributeAllowList) {
    return new AllowListProcessor(attributeAllowList);
  }
  exports.createAllowListAttributesProcessor = createAllowListAttributesProcessor;
  function createDenyListAttributesProcessor(attributeDenyList) {
    return new DenyListProcessor(attributeDenyList);
  }
  exports.createDenyListAttributesProcessor = createDenyListAttributesProcessor;
  var NOOP = new NoopAttributesProcessor;
});
