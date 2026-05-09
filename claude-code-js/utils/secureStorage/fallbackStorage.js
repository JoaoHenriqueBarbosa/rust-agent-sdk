// Original: src/utils/secureStorage/fallbackStorage.ts
function createFallbackStorage(primary, secondary) {
  return {
    name: `${primary.name}-with-${secondary.name}-fallback`,
    read() {
      let result = primary.read();
      if (result !== null && result !== void 0)
        return result;
      return secondary.read() || {};
    },
    async readAsync() {
      let result = await primary.readAsync();
      if (result !== null && result !== void 0)
        return result;
      return await secondary.readAsync() || {};
    },
    update(data) {
      let primaryDataBefore = primary.read(), result = primary.update(data);
      if (result.success) {
        if (primaryDataBefore === null)
          secondary.delete();
        return result;
      }
      let fallbackResult = secondary.update(data);
      if (fallbackResult.success) {
        if (primaryDataBefore !== null)
          primary.delete();
        return {
          success: !0,
          warning: fallbackResult.warning
        };
      }
      return { success: !1 };
    },
    delete() {
      let primarySuccess = primary.delete(), secondarySuccess = secondary.delete();
      return primarySuccess || secondarySuccess;
    }
  };
}
