// Original: src/utils/permissions/PermissionUpdate.ts
import { posix } from "path";
function extractRules(updates) {
  if (!updates)
    return [];
  return updates.flatMap((update) => {
    switch (update.type) {
      case "addRules":
        return update.rules;
      default:
        return [];
    }
  });
}
function applyPermissionUpdate(context3, update) {
  switch (update.type) {
    case "setMode":
      return logForDebugging(`Applying permission update: Setting mode to '${update.mode}'`), {
        ...context3,
        mode: update.mode
      };
    case "addRules": {
      let ruleStrings = update.rules.map((rule) => permissionRuleValueToString(rule));
      logForDebugging(`Applying permission update: Adding ${update.rules.length} ${update.behavior} rule(s) to destination '${update.destination}': ${jsonStringify(ruleStrings)}`);
      let ruleKind = update.behavior === "allow" ? "alwaysAllowRules" : update.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...context3,
        [ruleKind]: {
          ...context3[ruleKind],
          [update.destination]: [
            ...context3[ruleKind][update.destination] || [],
            ...ruleStrings
          ]
        }
      };
    }
    case "replaceRules": {
      let ruleStrings = update.rules.map((rule) => permissionRuleValueToString(rule));
      logForDebugging(`Replacing all ${update.behavior} rules for destination '${update.destination}' with ${update.rules.length} rule(s): ${jsonStringify(ruleStrings)}`);
      let ruleKind = update.behavior === "allow" ? "alwaysAllowRules" : update.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...context3,
        [ruleKind]: {
          ...context3[ruleKind],
          [update.destination]: ruleStrings
        }
      };
    }
    case "addDirectories": {
      logForDebugging(`Applying permission update: Adding ${update.directories.length} director${update.directories.length === 1 ? "y" : "ies"} with destination '${update.destination}': ${jsonStringify(update.directories)}`);
      let newAdditionalDirs = new Map(context3.additionalWorkingDirectories);
      for (let directory of update.directories)
        newAdditionalDirs.set(directory, {
          path: directory,
          source: update.destination
        });
      return {
        ...context3,
        additionalWorkingDirectories: newAdditionalDirs
      };
    }
    case "removeRules": {
      let ruleStrings = update.rules.map((rule) => permissionRuleValueToString(rule));
      logForDebugging(`Applying permission update: Removing ${update.rules.length} ${update.behavior} rule(s) from source '${update.destination}': ${jsonStringify(ruleStrings)}`);
      let ruleKind = update.behavior === "allow" ? "alwaysAllowRules" : update.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules", existingRules = context3[ruleKind][update.destination] || [], rulesToRemove = new Set(ruleStrings), filteredRules = existingRules.filter((rule) => !rulesToRemove.has(rule));
      return {
        ...context3,
        [ruleKind]: {
          ...context3[ruleKind],
          [update.destination]: filteredRules
        }
      };
    }
    case "removeDirectories": {
      logForDebugging(`Applying permission update: Removing ${update.directories.length} director${update.directories.length === 1 ? "y" : "ies"}: ${jsonStringify(update.directories)}`);
      let newAdditionalDirs = new Map(context3.additionalWorkingDirectories);
      for (let directory of update.directories)
        newAdditionalDirs.delete(directory);
      return {
        ...context3,
        additionalWorkingDirectories: newAdditionalDirs
      };
    }
    default:
      return context3;
  }
}
function applyPermissionUpdates(context3, updates) {
  let updatedContext = context3;
  for (let update of updates)
    updatedContext = applyPermissionUpdate(updatedContext, update);
  return updatedContext;
}
function supportsPersistence(destination) {
  return destination === "localSettings" || destination === "userSettings" || destination === "projectSettings";
}
function persistPermissionUpdate(update) {
  if (!supportsPersistence(update.destination))
    return;
  switch (logForDebugging(`Persisting permission update: ${update.type} to source '${update.destination}'`), update.type) {
    case "addRules": {
      logForDebugging(`Persisting ${update.rules.length} ${update.behavior} rule(s) to ${update.destination}`), addPermissionRulesToSettings({
        ruleValues: update.rules,
        ruleBehavior: update.behavior
      }, update.destination);
      break;
    }
    case "addDirectories": {
      logForDebugging(`Persisting ${update.directories.length} director${update.directories.length === 1 ? "y" : "ies"} to ${update.destination}`);
      let existingDirs = getSettingsForSource(update.destination)?.permissions?.additionalDirectories || [], dirsToAdd = update.directories.filter((dir) => !existingDirs.includes(dir));
      if (dirsToAdd.length > 0) {
        let updatedDirs = [...existingDirs, ...dirsToAdd];
        updateSettingsForSource(update.destination, {
          permissions: {
            additionalDirectories: updatedDirs
          }
        });
      }
      break;
    }
    case "removeRules": {
      logForDebugging(`Removing ${update.rules.length} ${update.behavior} rule(s) from ${update.destination}`);
      let existingRules = (getSettingsForSource(update.destination)?.permissions || {})[update.behavior] || [], rulesToRemove = new Set(update.rules.map(permissionRuleValueToString)), filteredRules = existingRules.filter((rule) => {
        let normalized = permissionRuleValueToString(permissionRuleValueFromString(rule));
        return !rulesToRemove.has(normalized);
      });
      updateSettingsForSource(update.destination, {
        permissions: {
          [update.behavior]: filteredRules
        }
      });
      break;
    }
    case "removeDirectories": {
      logForDebugging(`Removing ${update.directories.length} director${update.directories.length === 1 ? "y" : "ies"} from ${update.destination}`);
      let existingDirs = getSettingsForSource(update.destination)?.permissions?.additionalDirectories || [], dirsToRemove = new Set(update.directories), filteredDirs = existingDirs.filter((dir) => !dirsToRemove.has(dir));
      updateSettingsForSource(update.destination, {
        permissions: {
          additionalDirectories: filteredDirs
        }
      });
      break;
    }
    case "setMode": {
      logForDebugging(`Persisting mode '${update.mode}' to ${update.destination}`), updateSettingsForSource(update.destination, {
        permissions: {
          defaultMode: update.mode
        }
      });
      break;
    }
    case "replaceRules": {
      logForDebugging(`Replacing all ${update.behavior} rules in ${update.destination} with ${update.rules.length} rule(s)`);
      let ruleStrings = update.rules.map(permissionRuleValueToString);
      updateSettingsForSource(update.destination, {
        permissions: {
          [update.behavior]: ruleStrings
        }
      });
      break;
    }
  }
}
function persistPermissionUpdates(updates) {
  for (let update of updates)
    persistPermissionUpdate(update);
}
function createReadRuleSuggestion(dirPath, destination = "session") {
  let pathForPattern = toPosixPath(dirPath);
  if (pathForPattern === "/")
    return;
  return {
    type: "addRules",
    rules: [
      {
        toolName: "Read",
        ruleContent: posix.isAbsolute(pathForPattern) ? `/${pathForPattern}/**` : `${pathForPattern}/**`
      }
    ],
    behavior: "allow",
    destination
  };
}
var init_PermissionUpdate = __esm(() => {
  init_debug();
  init_settings2();
  init_slowOperations();
  init_filesystem();
  init_permissionRuleParser();
  init_permissionsLoader();
});
