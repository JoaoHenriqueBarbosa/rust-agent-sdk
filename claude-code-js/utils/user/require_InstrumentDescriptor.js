// var: require_InstrumentDescriptor
var require_InstrumentDescriptor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isValidName = exports.isDescriptorCompatibleWith = exports.createInstrumentDescriptorWithView = exports.createInstrumentDescriptor = void 0;
  var api_1 = require_src7(), utils_1 = require_utils11();
  function createInstrumentDescriptor(name3, type, options2) {
    if (!isValidName(name3))
      api_1.diag.warn(`Invalid metric name: "${name3}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
    return {
      name: name3,
      type,
      description: options2?.description ?? "",
      unit: options2?.unit ?? "",
      valueType: options2?.valueType ?? api_1.ValueType.DOUBLE,
      advice: options2?.advice ?? {}
    };
  }
  exports.createInstrumentDescriptor = createInstrumentDescriptor;
  function createInstrumentDescriptorWithView(view, instrument) {
    return {
      name: view.name ?? instrument.name,
      description: view.description ?? instrument.description,
      type: instrument.type,
      unit: instrument.unit,
      valueType: instrument.valueType,
      advice: instrument.advice
    };
  }
  exports.createInstrumentDescriptorWithView = createInstrumentDescriptorWithView;
  function isDescriptorCompatibleWith(descriptor, otherDescriptor) {
    return (0, utils_1.equalsCaseInsensitive)(descriptor.name, otherDescriptor.name) && descriptor.unit === otherDescriptor.unit && descriptor.type === otherDescriptor.type && descriptor.valueType === otherDescriptor.valueType;
  }
  exports.isDescriptorCompatibleWith = isDescriptorCompatibleWith;
  var NAME_REGEXP = /^[a-z][a-z0-9_.\-/]{0,254}$/i;
  function isValidName(name3) {
    return NAME_REGEXP.test(name3);
  }
  exports.isValidName = isValidName;
});
