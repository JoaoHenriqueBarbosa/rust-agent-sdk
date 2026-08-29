// Original: src/services/lsp/LSPServerManager.ts
import * as path18 from "path";
import { pathToFileURL as pathToFileURL5 } from "url";
function createLSPServerManager() {
  let servers = /* @__PURE__ */ new Map, extensionMap = /* @__PURE__ */ new Map, openedFiles = /* @__PURE__ */ new Map;
  async function initialize4() {
    let serverConfigs;
    try {
      serverConfigs = (await getAllLspServers()).servers, logForDebugging(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(serverConfigs).length} server(s)`);
    } catch (error44) {
      throw logError2(Error(`Failed to load LSP server configuration: ${error44.message}`)), error44;
    }
    for (let [serverName, config10] of Object.entries(serverConfigs))
      try {
        if (!config10.command)
          throw Error(`Server ${serverName} missing required 'command' field`);
        if (!config10.extensionToLanguage || Object.keys(config10.extensionToLanguage).length === 0)
          throw Error(`Server ${serverName} missing required 'extensionToLanguage' field`);
        let fileExtensions = Object.keys(config10.extensionToLanguage);
        for (let ext of fileExtensions) {
          let normalized = ext.toLowerCase();
          if (!extensionMap.has(normalized))
            extensionMap.set(normalized, []);
          let serverList = extensionMap.get(normalized);
          if (serverList)
            serverList.push(serverName);
        }
        let instance = createLSPServerInstance(serverName, config10);
        servers.set(serverName, instance), instance.onRequest("workspace/configuration", (params) => {
          return logForDebugging(`LSP: Received workspace/configuration request from ${serverName}`), params.items.map(() => null);
        });
      } catch (error44) {
        logError2(Error(`Failed to initialize LSP server ${serverName}: ${error44.message}`));
      }
    logForDebugging(`LSP manager initialized with ${servers.size} servers`);
  }
  async function shutdown() {
    let toStop = Array.from(servers.entries()).filter(([, s2]) => s2.state === "running" || s2.state === "error"), results = await Promise.allSettled(toStop.map(([, server]) => server.stop()));
    servers.clear(), extensionMap.clear(), openedFiles.clear();
    let errors8 = results.map((r4, i5) => r4.status === "rejected" ? `${toStop[i5][0]}: ${errorMessage(r4.reason)}` : null).filter((e) => e !== null);
    if (errors8.length > 0) {
      let err2 = Error(`Failed to stop ${errors8.length} LSP server(s): ${errors8.join("; ")}`);
      throw logError2(err2), err2;
    }
  }
  function getServerForFile(filePath) {
    let ext = path18.extname(filePath).toLowerCase(), serverNames = extensionMap.get(ext);
    if (!serverNames || serverNames.length === 0)
      return;
    let serverName = serverNames[0];
    if (!serverName)
      return;
    return servers.get(serverName);
  }
  async function ensureServerStarted(filePath) {
    let server = getServerForFile(filePath);
    if (!server)
      return;
    if (server.state === "stopped" || server.state === "error")
      try {
        await server.start();
      } catch (error44) {
        throw logError2(Error(`Failed to start LSP server for file ${filePath}: ${error44.message}`)), error44;
      }
    return server;
  }
  async function sendRequest(filePath, method, params) {
    let server = await ensureServerStarted(filePath);
    if (!server)
      return;
    try {
      return await server.sendRequest(method, params);
    } catch (error44) {
      throw logError2(Error(`LSP request failed for file ${filePath}, method '${method}': ${error44.message}`)), error44;
    }
  }
  function getAllServers() {
    return servers;
  }
  async function openFile(filePath, content) {
    let server = await ensureServerStarted(filePath);
    if (!server)
      return;
    let fileUri = pathToFileURL5(path18.resolve(filePath)).href;
    if (openedFiles.get(fileUri) === server.name) {
      logForDebugging(`LSP: File already open, skipping didOpen for ${filePath}`);
      return;
    }
    let ext = path18.extname(filePath).toLowerCase(), languageId = server.config.extensionToLanguage[ext] || "plaintext";
    try {
      await server.sendNotification("textDocument/didOpen", {
        textDocument: {
          uri: fileUri,
          languageId,
          version: 1,
          text: content
        }
      }), openedFiles.set(fileUri, server.name), logForDebugging(`LSP: Sent didOpen for ${filePath} (languageId: ${languageId})`);
    } catch (error44) {
      let err2 = Error(`Failed to sync file open ${filePath}: ${errorMessage(error44)}`);
      throw logError2(err2), err2;
    }
  }
  async function changeFile(filePath, content) {
    let server = getServerForFile(filePath);
    if (!server || server.state !== "running")
      return openFile(filePath, content);
    let fileUri = pathToFileURL5(path18.resolve(filePath)).href;
    if (openedFiles.get(fileUri) !== server.name)
      return openFile(filePath, content);
    try {
      await server.sendNotification("textDocument/didChange", {
        textDocument: {
          uri: fileUri,
          version: 1
        },
        contentChanges: [{ text: content }]
      }), logForDebugging(`LSP: Sent didChange for ${filePath}`);
    } catch (error44) {
      let err2 = Error(`Failed to sync file change ${filePath}: ${errorMessage(error44)}`);
      throw logError2(err2), err2;
    }
  }
  async function saveFile(filePath) {
    let server = getServerForFile(filePath);
    if (!server || server.state !== "running")
      return;
    try {
      await server.sendNotification("textDocument/didSave", {
        textDocument: {
          uri: pathToFileURL5(path18.resolve(filePath)).href
        }
      }), logForDebugging(`LSP: Sent didSave for ${filePath}`);
    } catch (error44) {
      let err2 = Error(`Failed to sync file save ${filePath}: ${errorMessage(error44)}`);
      throw logError2(err2), err2;
    }
  }
  async function closeFile(filePath) {
    let server = getServerForFile(filePath);
    if (!server || server.state !== "running")
      return;
    let fileUri = pathToFileURL5(path18.resolve(filePath)).href;
    try {
      await server.sendNotification("textDocument/didClose", {
        textDocument: {
          uri: fileUri
        }
      }), openedFiles.delete(fileUri), logForDebugging(`LSP: Sent didClose for ${filePath}`);
    } catch (error44) {
      let err2 = Error(`Failed to sync file close ${filePath}: ${errorMessage(error44)}`);
      throw logError2(err2), err2;
    }
  }
  function isFileOpen(filePath) {
    let fileUri = pathToFileURL5(path18.resolve(filePath)).href;
    return openedFiles.has(fileUri);
  }
  return {
    initialize: initialize4,
    shutdown,
    getServerForFile,
    ensureServerStarted,
    sendRequest,
    getAllServers,
    openFile,
    changeFile,
    saveFile,
    closeFile,
    isFileOpen
  };
}
var init_LSPServerManager = __esm(() => {
  init_debug();
  init_errors();
  init_log3();
  init_config10();
  init_LSPServerInstance();
});
