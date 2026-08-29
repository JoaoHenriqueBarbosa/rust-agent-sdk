// class: WatchHelper
class WatchHelper {
  constructor(path12, follow, fsw) {
    this.fsw = fsw;
    let watchPath = path12;
    this.path = path12 = path12.replace(REPLACER_RE, ""), this.watchPath = watchPath, this.fullWatchPath = sysPath2.resolve(watchPath), this.dirParts = [], this.dirParts.forEach((parts) => {
      if (parts.length > 1)
        parts.pop();
    }), this.followSymlinks = follow, this.statMethod = follow ? STAT_METHOD_F : STAT_METHOD_L;
  }
  entryPath(entry) {
    return sysPath2.join(this.watchPath, sysPath2.relative(this.watchPath, entry.fullPath));
  }
  filterPath(entry) {
    let { stats } = entry;
    if (stats && stats.isSymbolicLink())
      return this.filterDir(entry);
    let resolvedPath5 = this.entryPath(entry);
    return this.fsw._isntIgnored(resolvedPath5, stats) && this.fsw._hasReadPermissions(stats);
  }
  filterDir(entry) {
    return this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
  }
}
