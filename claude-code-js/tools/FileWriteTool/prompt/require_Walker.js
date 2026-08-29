// var: require_Walker
var require_Walker = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Walker = void 0;
  var debug = require_src(), fs14 = require_lib2(), path16 = __require("path"), depTypes_1 = require_depTypes(), nativeModuleTypes_1 = require_nativeModuleTypes(), d = debug("flora-colossus");

  class Walker {
    constructor(modulePath) {
      if (this.modules = [], this.walkHistory = /* @__PURE__ */ new Set, this.cache = null, !modulePath || typeof modulePath !== "string")
        throw Error("modulePath must be provided as a string");
      d(`creating walker with rootModule=${modulePath}`), this.rootModule = modulePath;
    }
    relativeModule(rootPath, moduleName) {
      return path16.resolve(rootPath, "node_modules", moduleName);
    }
    async loadPackageJSON(modulePath) {
      let pJPath = path16.resolve(modulePath, "package.json");
      if (await fs14.pathExists(pJPath)) {
        let pJ = await fs14.readJson(pJPath);
        if (!pJ.dependencies)
          pJ.dependencies = {};
        if (!pJ.devDependencies)
          pJ.devDependencies = {};
        if (!pJ.optionalDependencies)
          pJ.optionalDependencies = {};
        return pJ;
      }
      return null;
    }
    async walkDependenciesForModuleInModule(moduleName, modulePath, depType) {
      let testPath = modulePath, discoveredPath = null, lastRelative = null;
      while (!discoveredPath && this.relativeModule(testPath, moduleName) !== lastRelative)
        if (lastRelative = this.relativeModule(testPath, moduleName), await fs14.pathExists(lastRelative))
          discoveredPath = lastRelative;
        else {
          if (path16.basename(path16.dirname(testPath)) !== "node_modules")
            testPath = path16.dirname(testPath);
          testPath = path16.dirname(path16.dirname(testPath));
        }
      if (!discoveredPath && depType !== depTypes_1.DepType.OPTIONAL && depType !== depTypes_1.DepType.DEV_OPTIONAL)
        throw Error(`Failed to locate module "${moduleName}" from "${modulePath}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
      if (discoveredPath)
        await this.walkDependenciesForModule(discoveredPath, depType);
    }
    async detectNativeModuleType(modulePath, pJ) {
      if (pJ.dependencies["prebuild-install"])
        return nativeModuleTypes_1.NativeModuleType.PREBUILD;
      else if (await fs14.pathExists(path16.join(modulePath, "binding.gyp")))
        return nativeModuleTypes_1.NativeModuleType.NODE_GYP;
      return nativeModuleTypes_1.NativeModuleType.NONE;
    }
    async walkDependenciesForModule(modulePath, depType) {
      if (d("walk reached:", modulePath, " Type is:", depTypes_1.DepType[depType]), this.walkHistory.has(modulePath)) {
        d("already walked this route");
        let existingModule = this.modules.find((module2) => module2.path === modulePath);
        if ((0, depTypes_1.depTypeGreater)(depType, existingModule.depType))
          d(`existing module has a type of "${existingModule.depType}", new module type would be "${depType}" therefore updating`), existingModule.depType = depType;
        return;
      }
      let pJ = await this.loadPackageJSON(modulePath);
      if (!pJ) {
        d("walk hit a dead end, this module is incomplete");
        return;
      }
      this.walkHistory.add(modulePath), this.modules.push({
        depType,
        nativeModuleType: await this.detectNativeModuleType(modulePath, pJ),
        path: modulePath,
        name: pJ.name
      });
      for (let moduleName in pJ.dependencies) {
        if (moduleName in pJ.optionalDependencies) {
          d(`found ${moduleName} in prod deps of ${modulePath} but it is also marked optional`);
          continue;
        }
        await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.PROD));
      }
      for (let moduleName in pJ.optionalDependencies)
        await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.OPTIONAL));
      if (depType === depTypes_1.DepType.ROOT) {
        d("we're still at the beginning, walking down the dev route");
        for (let moduleName in pJ.devDependencies)
          await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.DEV));
      }
    }
    async walkTree() {
      if (d("starting tree walk"), !this.cache)
        this.cache = new Promise(async (resolve20, reject2) => {
          this.modules = [];
          try {
            await this.walkDependenciesForModule(this.rootModule, depTypes_1.DepType.ROOT);
          } catch (err2) {
            reject2(err2);
            return;
          }
          resolve20(this.modules);
        });
      else
        d("tree walk in progress / completed already, waiting for existing walk to complete");
      return await this.cache;
    }
    getRootModule() {
      return this.rootModule;
    }
  }
  exports.Walker = Walker;
});
