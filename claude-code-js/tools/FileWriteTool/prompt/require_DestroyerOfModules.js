// var: require_DestroyerOfModules
var require_DestroyerOfModules = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DestroyerOfModules = void 0;
  var fs14 = require_lib2(), path16 = __require("path"), flora_colossus_1 = require_lib3();

  class DestroyerOfModules {
    constructor({ rootDirectory, walker, shouldKeepModuleTest }) {
      if (rootDirectory)
        this.walker = new flora_colossus_1.Walker(rootDirectory);
      else if (walker)
        this.walker = walker;
      else
        throw Error("Must either provide rootDirectory or walker argument");
      if (shouldKeepModuleTest)
        this.shouldKeepFn = shouldKeepModuleTest;
    }
    async destroyModule(modulePath, moduleMap) {
      if (moduleMap.get(modulePath)) {
        let nodeModulesPath = path16.resolve(modulePath, "node_modules");
        if (!await fs14.pathExists(nodeModulesPath))
          return;
        for (let subModuleName of await fs14.readdir(nodeModulesPath))
          if (subModuleName.startsWith("@"))
            for (let subScopedModuleName of await fs14.readdir(path16.resolve(nodeModulesPath, subModuleName)))
              await this.destroyModule(path16.resolve(nodeModulesPath, subModuleName, subScopedModuleName), moduleMap);
          else
            await this.destroyModule(path16.resolve(nodeModulesPath, subModuleName), moduleMap);
      } else
        await fs14.remove(modulePath);
    }
    async collectKeptModules({ relativePaths = !1 }) {
      let modules = await this.walker.walkTree(), moduleMap = /* @__PURE__ */ new Map, rootPath = path16.resolve(this.walker.getRootModule());
      for (let module2 of modules)
        if (this.shouldKeepModule(module2)) {
          let modulePath = module2.path;
          if (relativePaths)
            modulePath = modulePath.replace(`${rootPath}${path16.sep}`, "");
          moduleMap.set(modulePath, module2);
        }
      return moduleMap;
    }
    async destroy() {
      await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({ relativePaths: !1 }));
    }
    shouldKeepModule(module2) {
      let isDevDep = module2.depType === flora_colossus_1.DepType.DEV || module2.depType === flora_colossus_1.DepType.DEV_OPTIONAL;
      return this.shouldKeepFn ? this.shouldKeepFn(module2, isDevDep) : !isDevDep;
    }
  }
  exports.DestroyerOfModules = DestroyerOfModules;
});
