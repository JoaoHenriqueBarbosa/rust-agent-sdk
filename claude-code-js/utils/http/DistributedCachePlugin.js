// class: DistributedCachePlugin
class DistributedCachePlugin {
  constructor(client14, partitionManager) {
    this.client = client14, this.partitionManager = partitionManager;
  }
  async beforeCacheAccess(cacheContext) {
    let partitionKey = await this.partitionManager.getKey(), cacheData = await this.client.get(partitionKey);
    cacheContext.tokenCache.deserialize(cacheData);
  }
  async afterCacheAccess(cacheContext) {
    if (cacheContext.cacheHasChanged) {
      let kvStore = cacheContext.tokenCache.getKVStore(), accountEntities = Object.values(kvStore).filter((value) => exports_AccountEntityUtils.isAccountEntity(value)), partitionKey;
      if (accountEntities.length > 0) {
        let accountEntity = accountEntities[0];
        partitionKey = await this.partitionManager.extractKey(accountEntity);
      } else
        partitionKey = await this.partitionManager.getKey();
      await this.client.set(partitionKey, cacheContext.tokenCache.serialize());
    }
  }
}
