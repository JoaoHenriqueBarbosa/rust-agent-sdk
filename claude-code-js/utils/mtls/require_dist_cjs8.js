// var: require_dist_cjs8
var require_dist_cjs8 = __commonJS((exports) => {
  var getHomeDir = require_getHomeDir(), getSSOTokenFilepath = require_getSSOTokenFilepath(), getSSOTokenFromFile = require_getSSOTokenFromFile(), path9 = __require("path"), types = require_dist_cjs7(), readFile6 = require_readFile(), ENV_PROFILE = "AWS_PROFILE", DEFAULT_PROFILE = "default", getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE, CONFIG_PREFIX_SEPARATOR = ".", getConfigData = (data) => Object.entries(data).filter(([key]) => {
    let indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
    if (indexOfSeparator === -1)
      return !1;
    return Object.values(types.IniSectionType).includes(key.substring(0, indexOfSeparator));
  }).reduce((acc, [key, value]) => {
    let indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR), updatedKey = key.substring(0, indexOfSeparator) === types.IniSectionType.PROFILE ? key.substring(indexOfSeparator + 1) : key;
    return acc[updatedKey] = value, acc;
  }, {
    ...data.default && { default: data.default }
  }), ENV_CONFIG_PATH = "AWS_CONFIG_FILE", getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || path9.join(getHomeDir.getHomeDir(), ".aws", "config"), ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE", getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || path9.join(getHomeDir.getHomeDir(), ".aws", "credentials"), prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/, profileNameBlockList = ["__proto__", "profile __proto__"], parseIni = (iniData) => {
    let map2 = {}, currentSection, currentSubSection;
    for (let iniLine of iniData.split(/\r?\n/)) {
      let trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
      if (trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]") {
        currentSection = void 0, currentSubSection = void 0;
        let sectionName = trimmedLine.substring(1, trimmedLine.length - 1), matches = prefixKeyRegex.exec(sectionName);
        if (matches) {
          let [, prefix, , name] = matches;
          if (Object.values(types.IniSectionType).includes(prefix))
            currentSection = [prefix, name].join(CONFIG_PREFIX_SEPARATOR);
        } else
          currentSection = sectionName;
        if (profileNameBlockList.includes(sectionName))
          throw Error(`Found invalid profile name "${sectionName}"`);
      } else if (currentSection) {
        let indexOfEqualsSign = trimmedLine.indexOf("=");
        if (![0, -1].includes(indexOfEqualsSign)) {
          let [name, value] = [
            trimmedLine.substring(0, indexOfEqualsSign).trim(),
            trimmedLine.substring(indexOfEqualsSign + 1).trim()
          ];
          if (value === "")
            currentSubSection = name;
          else {
            if (currentSubSection && iniLine.trimStart() === iniLine)
              currentSubSection = void 0;
            map2[currentSection] = map2[currentSection] || {};
            let key = currentSubSection ? [currentSubSection, name].join(CONFIG_PREFIX_SEPARATOR) : name;
            map2[currentSection][key] = value;
          }
        }
      }
    }
    return map2;
  }, swallowError$1 = () => ({}), loadSharedConfigFiles = async (init = {}) => {
    let { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init, homeDir = getHomeDir.getHomeDir(), relativeHomeDirPrefix = "~/", resolvedFilepath = filepath;
    if (filepath.startsWith("~/"))
      resolvedFilepath = path9.join(homeDir, filepath.slice(2));
    let resolvedConfigFilepath = configFilepath;
    if (configFilepath.startsWith("~/"))
      resolvedConfigFilepath = path9.join(homeDir, configFilepath.slice(2));
    let parsedFiles = await Promise.all([
      readFile6.readFile(resolvedConfigFilepath, {
        ignoreCache: init.ignoreCache
      }).then(parseIni).then(getConfigData).catch(swallowError$1),
      readFile6.readFile(resolvedFilepath, {
        ignoreCache: init.ignoreCache
      }).then(parseIni).catch(swallowError$1)
    ]);
    return {
      configFile: parsedFiles[0],
      credentialsFile: parsedFiles[1]
    };
  }, getSsoSessionData = (data) => Object.entries(data).filter(([key]) => key.startsWith(types.IniSectionType.SSO_SESSION + CONFIG_PREFIX_SEPARATOR)).reduce((acc, [key, value]) => ({ ...acc, [key.substring(key.indexOf(CONFIG_PREFIX_SEPARATOR) + 1)]: value }), {}), swallowError = () => ({}), loadSsoSessionData = async (init = {}) => readFile6.readFile(init.configFilepath ?? getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError), mergeConfigFiles = (...files) => {
    let merged = {};
    for (let file2 of files)
      for (let [key, values] of Object.entries(file2))
        if (merged[key] !== void 0)
          Object.assign(merged[key], values);
        else
          merged[key] = values;
    return merged;
  }, parseKnownFiles = async (init) => {
    let parsedFiles = await loadSharedConfigFiles(init);
    return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
  }, externalDataInterceptor = {
    getFileRecord() {
      return readFile6.fileIntercept;
    },
    interceptFile(path10, contents) {
      readFile6.fileIntercept[path10] = Promise.resolve(contents);
    },
    getTokenRecord() {
      return getSSOTokenFromFile.tokenIntercept;
    },
    interceptToken(id, contents) {
      getSSOTokenFromFile.tokenIntercept[id] = contents;
    }
  };
  exports.getSSOTokenFromFile = getSSOTokenFromFile.getSSOTokenFromFile;
  exports.readFile = readFile6.readFile;
  exports.CONFIG_PREFIX_SEPARATOR = CONFIG_PREFIX_SEPARATOR;
  exports.DEFAULT_PROFILE = DEFAULT_PROFILE;
  exports.ENV_PROFILE = ENV_PROFILE;
  exports.externalDataInterceptor = externalDataInterceptor;
  exports.getProfileName = getProfileName;
  exports.loadSharedConfigFiles = loadSharedConfigFiles;
  exports.loadSsoSessionData = loadSsoSessionData;
  exports.parseKnownFiles = parseKnownFiles;
  Object.prototype.hasOwnProperty.call(getHomeDir, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: getHomeDir.__proto__
  });
  Object.keys(getHomeDir).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = getHomeDir[k];
  });
  Object.prototype.hasOwnProperty.call(getSSOTokenFilepath, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: getSSOTokenFilepath.__proto__
  });
  Object.keys(getSSOTokenFilepath).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = getSSOTokenFilepath[k];
  });
});
