// var: require_RegistrationConflicts
var require_RegistrationConflicts = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getConflictResolutionRecipe = exports.getDescriptionResolutionRecipe = exports.getTypeConflictResolutionRecipe = exports.getUnitConflictResolutionRecipe = exports.getValueTypeConflictResolutionRecipe = exports.getIncompatibilityDetails = void 0;
  function getIncompatibilityDetails(existing, otherDescriptor) {
    let incompatibility = "";
    if (existing.unit !== otherDescriptor.unit)
      incompatibility += `	- Unit '${existing.unit}' does not match '${otherDescriptor.unit}'
`;
    if (existing.type !== otherDescriptor.type)
      incompatibility += `	- Type '${existing.type}' does not match '${otherDescriptor.type}'
`;
    if (existing.valueType !== otherDescriptor.valueType)
      incompatibility += `	- Value Type '${existing.valueType}' does not match '${otherDescriptor.valueType}'
`;
    if (existing.description !== otherDescriptor.description)
      incompatibility += `	- Description '${existing.description}' does not match '${otherDescriptor.description}'
`;
    return incompatibility;
  }
  exports.getIncompatibilityDetails = getIncompatibilityDetails;
  function getValueTypeConflictResolutionRecipe(existing, otherDescriptor) {
    return `	- use valueType '${existing.valueType}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
  }
  exports.getValueTypeConflictResolutionRecipe = getValueTypeConflictResolutionRecipe;
  function getUnitConflictResolutionRecipe(existing, otherDescriptor) {
    return `	- use unit '${existing.unit}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
  }
  exports.getUnitConflictResolutionRecipe = getUnitConflictResolutionRecipe;
  function getTypeConflictResolutionRecipe(existing, otherDescriptor) {
    let selector = {
      name: otherDescriptor.name,
      type: otherDescriptor.type,
      unit: otherDescriptor.unit
    }, selectorString = JSON.stringify(selector);
    return `	- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'`;
  }
  exports.getTypeConflictResolutionRecipe = getTypeConflictResolutionRecipe;
  function getDescriptionResolutionRecipe(existing, otherDescriptor) {
    let selector = {
      name: otherDescriptor.name,
      type: otherDescriptor.type,
      unit: otherDescriptor.unit
    }, selectorString = JSON.stringify(selector);
    return `	- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'
    	- OR - create a new view with the name ${existing.name} and description '${existing.description}' and InstrumentSelector ${selectorString}
    	- OR - create a new view with the name ${otherDescriptor.name} and description '${existing.description}' and InstrumentSelector ${selectorString}`;
  }
  exports.getDescriptionResolutionRecipe = getDescriptionResolutionRecipe;
  function getConflictResolutionRecipe(existing, otherDescriptor) {
    if (existing.valueType !== otherDescriptor.valueType)
      return getValueTypeConflictResolutionRecipe(existing, otherDescriptor);
    if (existing.unit !== otherDescriptor.unit)
      return getUnitConflictResolutionRecipe(existing, otherDescriptor);
    if (existing.type !== otherDescriptor.type)
      return getTypeConflictResolutionRecipe(existing, otherDescriptor);
    if (existing.description !== otherDescriptor.description)
      return getDescriptionResolutionRecipe(existing, otherDescriptor);
    return "";
  }
  exports.getConflictResolutionRecipe = getConflictResolutionRecipe;
});
