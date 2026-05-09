// var: init_esm9
var init_esm9 = __esm(() => {
  EntryTypes = {
    FILE_TYPE: "files",
    DIR_TYPE: "directories",
    FILE_DIR_TYPE: "files_directories",
    EVERYTHING_TYPE: "all"
  }, defaultOptions = {
    root: ".",
    fileFilter: (_entryInfo) => !0,
    directoryFilter: (_entryInfo) => !0,
    type: EntryTypes.FILE_TYPE,
    lstat: !1,
    depth: 2147483648,
    alwaysStat: !1,
    highWaterMark: 4096
  };
  Object.freeze(defaultOptions);
  NORMAL_FLOW_ERRORS = /* @__PURE__ */ new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", RECURSIVE_ERROR_CODE]), ALL_TYPES = [
    EntryTypes.DIR_TYPE,
    EntryTypes.EVERYTHING_TYPE,
    EntryTypes.FILE_DIR_TYPE,
    EntryTypes.FILE_TYPE
  ], DIR_TYPES = /* @__PURE__ */ new Set([
    EntryTypes.DIR_TYPE,
    EntryTypes.EVERYTHING_TYPE,
    EntryTypes.FILE_DIR_TYPE
  ]), FILE_TYPES2 = /* @__PURE__ */ new Set([
    EntryTypes.EVERYTHING_TYPE,
    EntryTypes.FILE_DIR_TYPE,
    EntryTypes.FILE_TYPE
  ]), wantBigintFsStats = process.platform === "win32";
  ReaddirpStream = class ReaddirpStream extends Readable9 {
    constructor(options = {}) {
      super({
        objectMode: !0,
        autoDestroy: !0,
        highWaterMark: options.highWaterMark
      });
      let opts = { ...defaultOptions, ...options }, { root: root2, type } = opts;
      this._fileFilter = normalizeFilter(opts.fileFilter), this._directoryFilter = normalizeFilter(opts.directoryFilter);
      let statMethod = opts.lstat ? lstat : stat7;
      if (wantBigintFsStats)
        this._stat = (path12) => statMethod(path12, { bigint: !0 });
      else
        this._stat = statMethod;
      this._maxDepth = opts.depth ?? defaultOptions.depth, this._wantsDir = type ? DIR_TYPES.has(type) : !1, this._wantsFile = type ? FILE_TYPES2.has(type) : !1, this._wantsEverything = type === EntryTypes.EVERYTHING_TYPE, this._root = presolve(root2), this._isDirent = !opts.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = { encoding: "utf8", withFileTypes: this._isDirent }, this.parents = [this._exploreDir(root2, 1)], this.reading = !1, this.parent = void 0;
    }
    async _read(batch) {
      if (this.reading)
        return;
      this.reading = !0;
      try {
        while (!this.destroyed && batch > 0) {
          let par = this.parent, fil = par && par.files;
          if (fil && fil.length > 0) {
            let { path: path12, depth } = par, slice = fil.splice(0, batch).map((dirent) => this._formatEntry(dirent, path12)), awaited = await Promise.all(slice);
            for (let entry of awaited) {
              if (!entry)
                continue;
              if (this.destroyed)
                return;
              let entryType = await this._getEntryType(entry);
              if (entryType === "directory" && this._directoryFilter(entry)) {
                if (depth <= this._maxDepth)
                  this.parents.push(this._exploreDir(entry.fullPath, depth + 1));
                if (this._wantsDir)
                  this.push(entry), batch--;
              } else if ((entryType === "file" || this._includeAsFile(entry)) && this._fileFilter(entry)) {
                if (this._wantsFile)
                  this.push(entry), batch--;
              }
            }
          } else {
            let parent = this.parents.pop();
            if (!parent) {
              this.push(null);
              break;
            }
            if (this.parent = await parent, this.destroyed)
              return;
          }
        }
      } catch (error44) {
        this.destroy(error44);
      } finally {
        this.reading = !1;
      }
    }
    async _exploreDir(path12, depth) {
      let files;
      try {
        files = await readdir4(path12, this._rdOptions);
      } catch (error44) {
        this._onError(error44);
      }
      return { files, depth, path: path12 };
    }
    async _formatEntry(dirent, path12) {
      let entry, basename5 = this._isDirent ? dirent.name : dirent;
      try {
        let fullPath = presolve(pjoin(path12, basename5));
        entry = { path: prelative(this._root, fullPath), fullPath, basename: basename5 }, entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
      } catch (err) {
        this._onError(err);
        return;
      }
      return entry;
    }
    _onError(err) {
      if (isNormalFlowError(err) && !this.destroyed)
        this.emit("warn", err);
      else
        this.destroy(err);
    }
    async _getEntryType(entry) {
      if (!entry && this._statsProp in entry)
        return "";
      let stats = entry[this._statsProp];
      if (stats.isFile())
        return "file";
      if (stats.isDirectory())
        return "directory";
      if (stats && stats.isSymbolicLink()) {
        let full = entry.fullPath;
        try {
          let entryRealPath = await realpath3(full), entryRealPathStats = await lstat(entryRealPath);
          if (entryRealPathStats.isFile())
            return "file";
          if (entryRealPathStats.isDirectory()) {
            let len = entryRealPath.length;
            if (full.startsWith(entryRealPath) && full.substr(len, 1) === psep) {
              let recursiveError = Error(`Circular symlink detected: "${full}" points to "${entryRealPath}"`);
              return recursiveError.code = RECURSIVE_ERROR_CODE, this._onError(recursiveError);
            }
            return "directory";
          }
        } catch (error44) {
          return this._onError(error44), "";
        }
      }
    }
    _includeAsFile(entry) {
      let stats = entry && entry[this._statsProp];
      return stats && this._wantsEverything && !stats.isDirectory();
    }
  };
});
