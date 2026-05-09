// var: require_dist_cjs72
var require_dist_cjs72 = __commonJS((exports) => {
  var __dirname = "/home/john/claude-de-gated/node_modules/@aws-sdk/util-user-agent-node/dist-cjs", node_os = __require("os"), node_process = __require("process"), utilConfigProvider = require_dist_cjs57(), promises = __require("fs/promises"), node_path = __require("path"), middlewareUserAgent = require_dist_cjs56(), getRuntimeUserAgentPair = () => {
    let runtimesToCheck = ["deno", "bun", "llrt"];
    for (let runtime of runtimesToCheck)
      if (node_process.versions[runtime])
        return [`md/${runtime}`, node_process.versions[runtime]];
    return ["md/nodejs", node_process.versions.node];
  }, getNodeModulesParentDirs = (dirname11) => {
    let cwd2 = process.cwd();
    if (!dirname11)
      return [cwd2];
    let normalizedPath = node_path.normalize(dirname11), parts = normalizedPath.split(node_path.sep), nodeModulesIndex = parts.indexOf("node_modules"), parentDir = nodeModulesIndex !== -1 ? parts.slice(0, nodeModulesIndex).join(node_path.sep) : normalizedPath;
    if (cwd2 === parentDir)
      return [cwd2];
    return [parentDir, cwd2];
  }, SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/, getSanitizedTypeScriptVersion = (version2 = "") => {
    let match = version2.match(SEMVER_REGEX);
    if (!match)
      return;
    let [major, minor, patch, prerelease] = [match[1], match[2], match[3], match[4]];
    return prerelease ? `${major}.${minor}.${patch}-${prerelease}` : `${major}.${minor}.${patch}`;
  }, ALLOWED_PREFIXES = ["^", "~", ">=", "<=", ">", "<"], ALLOWED_DIST_TAGS = ["latest", "beta", "dev", "rc", "insiders", "next"], getSanitizedDevTypeScriptVersion = (version2 = "") => {
    if (ALLOWED_DIST_TAGS.includes(version2))
      return version2;
    let prefix = ALLOWED_PREFIXES.find((p) => version2.startsWith(p)) ?? "", sanitizedTypeScriptVersion = getSanitizedTypeScriptVersion(version2.slice(prefix.length));
    if (!sanitizedTypeScriptVersion)
      return;
    return `${prefix}${sanitizedTypeScriptVersion}`;
  }, tscVersion, TS_PACKAGE_JSON = node_path.join("node_modules", "typescript", "package.json"), getTypeScriptUserAgentPair = async () => {
    if (tscVersion === null)
      return;
    else if (typeof tscVersion === "string")
      return ["md/tsc", tscVersion];
    let isTypeScriptDetectionDisabled = !1;
    try {
      isTypeScriptDetectionDisabled = utilConfigProvider.booleanSelector(process.env, "AWS_SDK_JS_TYPESCRIPT_DETECTION_DISABLED", utilConfigProvider.SelectorType.ENV) || !1;
    } catch {}
    if (isTypeScriptDetectionDisabled) {
      tscVersion = null;
      return;
    }
    let nodeModulesParentDirs = getNodeModulesParentDirs(typeof __dirname < "u" ? __dirname : void 0), versionFromApp;
    for (let nodeModulesParentDir of nodeModulesParentDirs)
      try {
        let appPackageJsonPath = node_path.join(nodeModulesParentDir, "package.json"), packageJson = await promises.readFile(appPackageJsonPath, "utf-8"), { dependencies, devDependencies } = JSON.parse(packageJson), version2 = devDependencies?.typescript ?? dependencies?.typescript;
        if (typeof version2 !== "string")
          continue;
        versionFromApp = version2;
        break;
      } catch {}
    if (!versionFromApp) {
      tscVersion = null;
      return;
    }
    let versionFromNodeModules;
    for (let nodeModulesParentDir of nodeModulesParentDirs)
      try {
        let tsPackageJsonPath = node_path.join(nodeModulesParentDir, TS_PACKAGE_JSON), packageJson = await promises.readFile(tsPackageJsonPath, "utf-8"), { version: version2 } = JSON.parse(packageJson), sanitizedVersion2 = getSanitizedTypeScriptVersion(version2);
        if (typeof sanitizedVersion2 !== "string")
          continue;
        versionFromNodeModules = sanitizedVersion2;
        break;
      } catch {}
    if (versionFromNodeModules)
      return tscVersion = versionFromNodeModules, ["md/tsc", tscVersion];
    let sanitizedVersion = getSanitizedDevTypeScriptVersion(versionFromApp);
    if (typeof sanitizedVersion !== "string") {
      tscVersion = null;
      return;
    }
    return tscVersion = `dev_${sanitizedVersion}`, ["md/tsc", tscVersion];
  }, crtAvailability = {
    isCrtAvailable: !1
  }, isCrtAvailable = () => {
    if (crtAvailability.isCrtAvailable)
      return ["md/crt-avail"];
    return null;
  }, createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
    let runtimeUserAgentPair = getRuntimeUserAgentPair();
    return async (config3) => {
      let sections = [
        ["aws-sdk-js", clientVersion],
        ["ua", "2.1"],
        [`os/${node_os.platform()}`, node_os.release()],
        ["lang/js"],
        runtimeUserAgentPair
      ], typescriptUserAgentPair = await getTypeScriptUserAgentPair();
      if (typescriptUserAgentPair)
        sections.push(typescriptUserAgentPair);
      let crtAvailable = isCrtAvailable();
      if (crtAvailable)
        sections.push(crtAvailable);
      if (serviceId)
        sections.push([`api/${serviceId}`, clientVersion]);
      if (node_process.env.AWS_EXECUTION_ENV)
        sections.push([`exec-env/${node_process.env.AWS_EXECUTION_ENV}`]);
      let appId = await config3?.userAgentAppId?.();
      return appId ? [...sections, [`app/${appId}`]] : [...sections];
    };
  }, defaultUserAgent = createDefaultUserAgentProvider, UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID", UA_APP_ID_INI_NAME = "sdk_ua_app_id", UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id", NODE_APP_ID_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => env4[UA_APP_ID_ENV_NAME],
    configFileSelector: (profile2) => profile2[UA_APP_ID_INI_NAME] ?? profile2[UA_APP_ID_INI_NAME_DEPRECATED],
    default: middlewareUserAgent.DEFAULT_UA_APP_ID
  };
  exports.NODE_APP_ID_CONFIG_OPTIONS = NODE_APP_ID_CONFIG_OPTIONS;
  exports.UA_APP_ID_ENV_NAME = UA_APP_ID_ENV_NAME;
  exports.UA_APP_ID_INI_NAME = UA_APP_ID_INI_NAME;
  exports.createDefaultUserAgentProvider = createDefaultUserAgentProvider;
  exports.crtAvailability = crtAvailability;
  exports.defaultUserAgent = defaultUserAgent;
});
