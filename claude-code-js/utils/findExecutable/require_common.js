// var: require_common
var require_common = __commonJS((exports, module) => {
  function setup(env3) {
    createDebug.debug = createDebug, createDebug.default = createDebug, createDebug.coerce = coerce, createDebug.disable = disable, createDebug.enable = enable, createDebug.enabled = enabled, createDebug.humanize = require_ms(), createDebug.destroy = destroy, Object.keys(env3).forEach((key) => {
      createDebug[key] = env3[key];
    }), createDebug.names = [], createDebug.skips = [], createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i2 = 0;i2 < namespace.length; i2++)
        hash = (hash << 5) - hash + namespace.charCodeAt(i2), hash |= 0;
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime, enableOverride = null, namespacesCache, enabledCache;
      function debug(...args) {
        if (!debug.enabled)
          return;
        let self2 = debug, curr = Number(/* @__PURE__ */ new Date), ms = curr - (prevTime || curr);
        if (self2.diff = ms, self2.prev = prevTime, self2.curr = curr, prevTime = curr, args[0] = createDebug.coerce(args[0]), typeof args[0] !== "string")
          args.unshift("%O");
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format3) => {
          if (match === "%%")
            return "%";
          index++;
          let formatter = createDebug.formatters[format3];
          if (typeof formatter === "function") {
            let val = args[index];
            match = formatter.call(self2, val), args.splice(index, 1), index--;
          }
          return match;
        }), createDebug.formatArgs.call(self2, args), (self2.log || createDebug.log).apply(self2, args);
      }
      if (debug.namespace = namespace, debug.useColors = createDebug.useColors(), debug.color = createDebug.selectColor(namespace), debug.extend = extend3, debug.destroy = createDebug.destroy, Object.defineProperty(debug, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => {
          if (enableOverride !== null)
            return enableOverride;
          if (namespacesCache !== createDebug.namespaces)
            namespacesCache = createDebug.namespaces, enabledCache = createDebug.enabled(namespace);
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      }), typeof createDebug.init === "function")
        createDebug.init(debug);
      return debug;
    }
    function extend3(namespace, delimiter) {
      let newDebug = createDebug(this.namespace + (typeof delimiter > "u" ? ":" : delimiter) + namespace);
      return newDebug.log = this.log, newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces), createDebug.namespaces = namespaces, createDebug.names = [], createDebug.skips = [];
      let split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (let ns of split)
        if (ns[0] === "-")
          createDebug.skips.push(ns.slice(1));
        else
          createDebug.names.push(ns);
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0, templateIndex = 0, starIndex = -1, matchIndex = 0;
      while (searchIndex < search.length)
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*"))
          if (template[templateIndex] === "*")
            starIndex = templateIndex, matchIndex = searchIndex, templateIndex++;
          else
            searchIndex++, templateIndex++;
        else if (starIndex !== -1)
          templateIndex = starIndex + 1, matchIndex++, searchIndex = matchIndex;
        else
          return !1;
      while (templateIndex < template.length && template[templateIndex] === "*")
        templateIndex++;
      return templateIndex === template.length;
    }
    function disable() {
      let namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      return createDebug.enable(""), namespaces;
    }
    function enabled(name) {
      for (let skip of createDebug.skips)
        if (matchesTemplate(name, skip))
          return !1;
      for (let ns of createDebug.names)
        if (matchesTemplate(name, ns))
          return !0;
      return !1;
    }
    function coerce(val) {
      if (val instanceof Error)
        return val.stack || val.message;
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return createDebug.enable(createDebug.load()), createDebug;
  }
  module.exports = setup;
});
