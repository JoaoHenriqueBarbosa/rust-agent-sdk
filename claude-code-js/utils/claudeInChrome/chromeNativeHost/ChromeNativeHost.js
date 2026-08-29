// class: ChromeNativeHost
class ChromeNativeHost {
  mcpClients = /* @__PURE__ */ new Map;
  nextClientId = 1;
  server = null;
  running = !1;
  socketPath = null;
  async start() {
    if (this.running)
      return;
    if (this.socketPath = getSecureSocketPath(), platform6() !== "win32") {
      let socketDir = getSocketDir();
      try {
        if (!(await stat42(socketDir)).isDirectory())
          await unlink22(socketDir);
      } catch {}
      await mkdir40(socketDir, { recursive: !0, mode: 448 }), await chmod11(socketDir, 448).catch(() => {});
      try {
        let files3 = await readdir29(socketDir);
        for (let file2 of files3) {
          if (!file2.endsWith(".sock"))
            continue;
          let pid = parseInt(file2.replace(".sock", ""), 10);
          if (isNaN(pid))
            continue;
          try {
            process.kill(pid, 0);
          } catch {
            await unlink22(join139(socketDir, file2)).catch(() => {}), log3(`Removed stale socket for PID ${pid}`);
          }
        }
      } catch {}
    }
    if (log3(`Creating socket listener: ${this.socketPath}`), this.server = createServer7((socket) => this.handleMcpClient(socket)), await new Promise((resolve45, reject2) => {
      this.server.listen(this.socketPath, () => {
        log3("Socket server listening for connections"), this.running = !0, resolve45();
      }), this.server.on("error", (err2) => {
        log3("Socket server error:", err2), reject2(err2);
      });
    }), platform6() !== "win32")
      try {
        await chmod11(this.socketPath, 384), log3("Socket permissions set to 0600");
      } catch (e) {
        log3("Failed to set socket permissions:", e);
      }
  }
  async stop() {
    if (!this.running)
      return;
    for (let [, client15] of this.mcpClients)
      client15.socket.destroy();
    if (this.mcpClients.clear(), this.server)
      await new Promise((resolve45) => {
        this.server.close(() => resolve45());
      }), this.server = null;
    if (platform6() !== "win32" && this.socketPath) {
      try {
        await unlink22(this.socketPath), log3("Cleaned up socket file");
      } catch {}
      try {
        let socketDir = getSocketDir();
        if ((await readdir29(socketDir)).length === 0)
          await rmdir3(socketDir), log3("Removed empty socket directory");
      } catch {}
    }
    this.running = !1;
  }
  async isRunning() {
    return this.running;
  }
  async getClientCount() {
    return this.mcpClients.size;
  }
  async handleMessage(messageJson) {
    let rawMessage;
    try {
      rawMessage = jsonParse(messageJson);
    } catch (e) {
      log3("Invalid JSON from Chrome:", e.message), sendChromeMessage(jsonStringify({
        type: "error",
        error: "Invalid message format"
      }));
      return;
    }
    let parsed = messageSchema().safeParse(rawMessage);
    if (!parsed.success) {
      log3("Invalid message from Chrome:", parsed.error.message), sendChromeMessage(jsonStringify({
        type: "error",
        error: "Invalid message format"
      }));
      return;
    }
    let message = parsed.data;
    switch (log3(`Handling Chrome message type: ${message.type}`), message.type) {
      case "ping":
        log3("Responding to ping"), sendChromeMessage(jsonStringify({
          type: "pong",
          timestamp: Date.now()
        }));
        break;
      case "get_status":
        sendChromeMessage(jsonStringify({
          type: "status_response",
          native_host_version: VERSION6
        }));
        break;
      case "tool_response": {
        if (this.mcpClients.size > 0) {
          log3(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
          let { type: _, ...data } = message, responseData = Buffer.from(jsonStringify(data), "utf-8"), lengthBuffer = Buffer.alloc(4);
          lengthBuffer.writeUInt32LE(responseData.length, 0);
          let responseMsg = Buffer.concat([lengthBuffer, responseData]);
          for (let [id, client15] of this.mcpClients)
            try {
              client15.socket.write(responseMsg);
            } catch (e) {
              log3(`Failed to send to MCP client ${id}:`, e);
            }
        }
        break;
      }
      case "notification": {
        if (this.mcpClients.size > 0) {
          log3(`Forwarding notification to ${this.mcpClients.size} MCP clients`);
          let { type: _, ...data } = message, notificationData = Buffer.from(jsonStringify(data), "utf-8"), lengthBuffer = Buffer.alloc(4);
          lengthBuffer.writeUInt32LE(notificationData.length, 0);
          let notificationMsg = Buffer.concat([
            lengthBuffer,
            notificationData
          ]);
          for (let [id, client15] of this.mcpClients)
            try {
              client15.socket.write(notificationMsg);
            } catch (e) {
              log3(`Failed to send notification to MCP client ${id}:`, e);
            }
        }
        break;
      }
      default:
        log3(`Unknown message type: ${message.type}`), sendChromeMessage(jsonStringify({
          type: "error",
          error: `Unknown message type: ${message.type}`
        }));
    }
  }
  handleMcpClient(socket) {
    let clientId = this.nextClientId++, client15 = {
      id: clientId,
      socket,
      buffer: Buffer.alloc(0)
    };
    this.mcpClients.set(clientId, client15), log3(`MCP client ${clientId} connected. Total clients: ${this.mcpClients.size}`), sendChromeMessage(jsonStringify({
      type: "mcp_connected"
    })), socket.on("data", (data) => {
      client15.buffer = Buffer.concat([client15.buffer, data]);
      while (client15.buffer.length >= 4) {
        let length = client15.buffer.readUInt32LE(0);
        if (length === 0 || length > MAX_MESSAGE_SIZE) {
          log3(`Invalid message length from MCP client ${clientId}: ${length}`), socket.destroy();
          return;
        }
        if (client15.buffer.length < 4 + length)
          break;
        let messageBytes = client15.buffer.slice(4, 4 + length);
        client15.buffer = client15.buffer.slice(4 + length);
        try {
          let request2 = jsonParse(messageBytes.toString("utf-8"));
          log3(`Forwarding tool request from MCP client ${clientId}: ${request2.method}`), sendChromeMessage(jsonStringify({
            type: "tool_request",
            method: request2.method,
            params: request2.params
          }));
        } catch (e) {
          log3(`Failed to parse tool request from MCP client ${clientId}:`, e);
        }
      }
    }), socket.on("error", (err2) => {
      log3(`MCP client ${clientId} error: ${err2}`);
    }), socket.on("close", () => {
      log3(`MCP client ${clientId} disconnected. Remaining clients: ${this.mcpClients.size - 1}`), this.mcpClients.delete(clientId), sendChromeMessage(jsonStringify({
        type: "mcp_disconnected"
      }));
    });
  }
}
