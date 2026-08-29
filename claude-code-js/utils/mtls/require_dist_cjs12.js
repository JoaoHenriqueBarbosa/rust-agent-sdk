// var: require_dist_cjs12
var require_dist_cjs12 = __commonJS((exports) => {
  var getAllAliases = (name, aliases) => {
    let _aliases = [];
    if (name)
      _aliases.push(name);
    if (aliases)
      for (let alias of aliases)
        _aliases.push(alias);
    return _aliases;
  }, getMiddlewareNameWithAliases = (name, aliases) => {
    return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
  }, constructStack = () => {
    let absoluteEntries = [], relativeEntries = [], identifyOnResolve = !1, entriesNameSet = /* @__PURE__ */ new Set, sort = (entries) => entries.sort((a2, b) => stepWeights[b.step] - stepWeights[a2.step] || priorityWeights[b.priority || "normal"] - priorityWeights[a2.priority || "normal"]), removeByName = (toRemove) => {
      let isRemoved = !1, filterCb = (entry) => {
        let aliases = getAllAliases(entry.name, entry.aliases);
        if (aliases.includes(toRemove)) {
          isRemoved = !0;
          for (let alias of aliases)
            entriesNameSet.delete(alias);
          return !1;
        }
        return !0;
      };
      return absoluteEntries = absoluteEntries.filter(filterCb), relativeEntries = relativeEntries.filter(filterCb), isRemoved;
    }, removeByReference = (toRemove) => {
      let isRemoved = !1, filterCb = (entry) => {
        if (entry.middleware === toRemove) {
          isRemoved = !0;
          for (let alias of getAllAliases(entry.name, entry.aliases))
            entriesNameSet.delete(alias);
          return !1;
        }
        return !0;
      };
      return absoluteEntries = absoluteEntries.filter(filterCb), relativeEntries = relativeEntries.filter(filterCb), isRemoved;
    }, cloneTo = (toStack) => {
      return absoluteEntries.forEach((entry) => {
        toStack.add(entry.middleware, { ...entry });
      }), relativeEntries.forEach((entry) => {
        toStack.addRelativeTo(entry.middleware, { ...entry });
      }), toStack.identifyOnResolve?.(stack.identifyOnResolve()), toStack;
    }, expandRelativeMiddlewareList = (from) => {
      let expandedMiddlewareList = [];
      return from.before.forEach((entry) => {
        if (entry.before.length === 0 && entry.after.length === 0)
          expandedMiddlewareList.push(entry);
        else
          expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }), expandedMiddlewareList.push(from), from.after.reverse().forEach((entry) => {
        if (entry.before.length === 0 && entry.after.length === 0)
          expandedMiddlewareList.push(entry);
        else
          expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }), expandedMiddlewareList;
    }, getMiddlewareList = (debug = !1) => {
      let normalizedAbsoluteEntries = [], normalizedRelativeEntries = [], normalizedEntriesNameMap = {};
      return absoluteEntries.forEach((entry) => {
        let normalizedEntry = {
          ...entry,
          before: [],
          after: []
        };
        for (let alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases))
          normalizedEntriesNameMap[alias] = normalizedEntry;
        normalizedAbsoluteEntries.push(normalizedEntry);
      }), relativeEntries.forEach((entry) => {
        let normalizedEntry = {
          ...entry,
          before: [],
          after: []
        };
        for (let alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases))
          normalizedEntriesNameMap[alias] = normalizedEntry;
        normalizedRelativeEntries.push(normalizedEntry);
      }), normalizedRelativeEntries.forEach((entry) => {
        if (entry.toMiddleware) {
          let toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
          if (toMiddleware === void 0) {
            if (debug)
              return;
            throw Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
          }
          if (entry.relation === "after")
            toMiddleware.after.push(entry);
          if (entry.relation === "before")
            toMiddleware.before.push(entry);
        }
      }), sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
        return wholeList.push(...expandedMiddlewareList), wholeList;
      }, []);
    }, stack = {
      add: (middleware2, options = {}) => {
        let { name, override, aliases: _aliases } = options, entry = {
          step: "initialize",
          priority: "normal",
          middleware: middleware2,
          ...options
        }, aliases = getAllAliases(name, _aliases);
        if (aliases.length > 0) {
          if (aliases.some((alias) => entriesNameSet.has(alias))) {
            if (!override)
              throw Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
            for (let alias of aliases) {
              let toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
              if (toOverrideIndex === -1)
                continue;
              let toOverride = absoluteEntries[toOverrideIndex];
              if (toOverride.step !== entry.step || entry.priority !== toOverride.priority)
                throw Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
              absoluteEntries.splice(toOverrideIndex, 1);
            }
          }
          for (let alias of aliases)
            entriesNameSet.add(alias);
        }
        absoluteEntries.push(entry);
      },
      addRelativeTo: (middleware2, options) => {
        let { name, override, aliases: _aliases } = options, entry = {
          middleware: middleware2,
          ...options
        }, aliases = getAllAliases(name, _aliases);
        if (aliases.length > 0) {
          if (aliases.some((alias) => entriesNameSet.has(alias))) {
            if (!override)
              throw Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
            for (let alias of aliases) {
              let toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
              if (toOverrideIndex === -1)
                continue;
              let toOverride = relativeEntries[toOverrideIndex];
              if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation)
                throw Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
              relativeEntries.splice(toOverrideIndex, 1);
            }
          }
          for (let alias of aliases)
            entriesNameSet.add(alias);
        }
        relativeEntries.push(entry);
      },
      clone: () => cloneTo(constructStack()),
      use: (plugin) => {
        plugin.applyToStack(stack);
      },
      remove: (toRemove) => {
        if (typeof toRemove === "string")
          return removeByName(toRemove);
        else
          return removeByReference(toRemove);
      },
      removeByTag: (toRemove) => {
        let isRemoved = !1, filterCb = (entry) => {
          let { tags, name, aliases: _aliases } = entry;
          if (tags && tags.includes(toRemove)) {
            let aliases = getAllAliases(name, _aliases);
            for (let alias of aliases)
              entriesNameSet.delete(alias);
            return isRemoved = !0, !1;
          }
          return !0;
        };
        return absoluteEntries = absoluteEntries.filter(filterCb), relativeEntries = relativeEntries.filter(filterCb), isRemoved;
      },
      concat: (from) => {
        let cloned = cloneTo(constructStack());
        return cloned.use(from), cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? !1)), cloned;
      },
      applyToStack: cloneTo,
      identify: () => {
        return getMiddlewareList(!0).map((mw) => {
          let step = mw.step ?? mw.relation + " " + mw.toMiddleware;
          return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
        });
      },
      identifyOnResolve(toggle) {
        if (typeof toggle === "boolean")
          identifyOnResolve = toggle;
        return identifyOnResolve;
      },
      resolve: (handler, context) => {
        for (let middleware2 of getMiddlewareList().map((entry) => entry.middleware).reverse())
          handler = middleware2(handler, context);
        if (identifyOnResolve)
          console.log(stack.identify());
        return handler;
      }
    };
    return stack;
  }, stepWeights = {
    initialize: 5,
    serialize: 4,
    build: 3,
    finalizeRequest: 2,
    deserialize: 1
  }, priorityWeights = {
    high: 3,
    normal: 2,
    low: 1
  };
  exports.constructStack = constructStack;
});
