// var: persistenceProvider
var persistenceProvider = void 0, msalNodeFlowCacheControl, nativeBrokerInfo = void 0, vsCodeAuthRecordPath = void 0, vsCodeBrokerInfo = void 0, msalNodeFlowNativeBrokerControl, msalNodeFlowVSCodeCredentialControl, brokerErrorTemplates, brokerConfig, msalPlugins;
var init_msalPlugins = __esm(() => {
  init_constants7();
  msalNodeFlowCacheControl = {
    setPersistence(pluginProvider) {
      persistenceProvider = pluginProvider;
    }
  };
  msalNodeFlowNativeBrokerControl = {
    setNativeBroker(broker) {
      nativeBrokerInfo = {
        broker
      };
    }
  }, msalNodeFlowVSCodeCredentialControl = {
    setVSCodeAuthRecordPath(path10) {
      vsCodeAuthRecordPath = path10;
    },
    setVSCodeBroker(broker) {
      vsCodeBrokerInfo = {
        broker
      };
    }
  };
  brokerErrorTemplates = {
    missing: (credentialName, packageName, pluginVar) => [
      `${credentialName} was requested, but no plugin was configured or no authentication record was found.`,
      `You must install the ${packageName} plugin package (npm install --save ${packageName})`,
      "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling",
      `useIdentityPlugin(${pluginVar}) before using enableBroker.`
    ].join(" "),
    unavailable: (credentialName, packageName) => [
      `${credentialName} was requested, and the plugin is configured, but the broker is unavailable.`,
      `Ensure the ${credentialName} plugin is properly installed and configured.`,
      "Check for missing native dependencies and ensure the package is properly installed.",
      `See the README for prerequisites on installing and using ${packageName}.`
    ].join(" ")
  }, brokerConfig = {
    vsCode: {
      credentialName: "Visual Studio Code Credential",
      packageName: "@azure/identity-vscode",
      pluginVar: "vsCodePlugin",
      get brokerInfo() {
        return vsCodeBrokerInfo;
      }
    },
    native: {
      credentialName: "Broker for WAM",
      packageName: "@azure/identity-broker",
      pluginVar: "nativeBrokerPlugin",
      get brokerInfo() {
        return nativeBrokerInfo;
      }
    }
  };
  msalPlugins = {
    generatePluginConfiguration
  };
});
