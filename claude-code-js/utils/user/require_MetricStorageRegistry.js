// var: require_MetricStorageRegistry
var require_MetricStorageRegistry = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MetricStorageRegistry = void 0;
  var InstrumentDescriptor_1 = require_InstrumentDescriptor(), api3 = require_src7(), RegistrationConflicts_1 = require_RegistrationConflicts();

  class MetricStorageRegistry {
    _sharedRegistry = /* @__PURE__ */ new Map;
    _perCollectorRegistry = /* @__PURE__ */ new Map;
    static create() {
      return new MetricStorageRegistry;
    }
    getStorages(collector) {
      let storages = [];
      for (let metricStorages of this._sharedRegistry.values())
        storages = storages.concat(metricStorages);
      let perCollectorStorages = this._perCollectorRegistry.get(collector);
      if (perCollectorStorages != null)
        for (let metricStorages of perCollectorStorages.values())
          storages = storages.concat(metricStorages);
      return storages;
    }
    register(storage) {
      this._registerStorage(storage, this._sharedRegistry);
    }
    registerForCollector(collector, storage) {
      let storageMap = this._perCollectorRegistry.get(collector);
      if (storageMap == null)
        storageMap = /* @__PURE__ */ new Map, this._perCollectorRegistry.set(collector, storageMap);
      this._registerStorage(storage, storageMap);
    }
    findOrUpdateCompatibleStorage(expectedDescriptor) {
      let storages = this._sharedRegistry.get(expectedDescriptor.name);
      if (storages === void 0)
        return null;
      return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
    }
    findOrUpdateCompatibleCollectorStorage(collector, expectedDescriptor) {
      let storageMap = this._perCollectorRegistry.get(collector);
      if (storageMap === void 0)
        return null;
      let storages = storageMap.get(expectedDescriptor.name);
      if (storages === void 0)
        return null;
      return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
    }
    _registerStorage(storage, storageMap) {
      let descriptor = storage.getInstrumentDescriptor(), storages = storageMap.get(descriptor.name);
      if (storages === void 0) {
        storageMap.set(descriptor.name, [storage]);
        return;
      }
      storages.push(storage);
    }
    _findOrUpdateCompatibleStorage(expectedDescriptor, existingStorages) {
      let compatibleStorage = null;
      for (let existingStorage of existingStorages) {
        let existingDescriptor = existingStorage.getInstrumentDescriptor();
        if ((0, InstrumentDescriptor_1.isDescriptorCompatibleWith)(existingDescriptor, expectedDescriptor)) {
          if (existingDescriptor.description !== expectedDescriptor.description) {
            if (expectedDescriptor.description.length > existingDescriptor.description.length)
              existingStorage.updateDescription(expectedDescriptor.description);
            api3.diag.warn("A view or instrument with the name ", expectedDescriptor.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), `The longer description will be used.
To resolve the conflict:`, (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
          }
          compatibleStorage = existingStorage;
        } else
          api3.diag.warn("A view or instrument with the name ", expectedDescriptor.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), `To resolve the conflict:
`, (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
      }
      return compatibleStorage;
    }
  }
  exports.MetricStorageRegistry = MetricStorageRegistry;
});
