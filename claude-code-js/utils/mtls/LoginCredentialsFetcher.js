// class: LoginCredentialsFetcher
class LoginCredentialsFetcher {
  profileData;
  init;
  callerClientConfig;
  static REFRESH_THRESHOLD = 300000;
  constructor(profileData, init, callerClientConfig) {
    this.profileData = profileData, this.init = init, this.callerClientConfig = callerClientConfig;
  }
  async loadCredentials() {
    let token = await this.loadToken();
    if (!token)
      throw new import_property_provider18.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, { tryNextLink: !1, logger: this.logger });
    let accessToken = token.accessToken, now = Date.now();
    if (new Date(accessToken.expiresAt).getTime() - now <= LoginCredentialsFetcher.REFRESH_THRESHOLD)
      return this.refresh(token);
    return {
      accessKeyId: accessToken.accessKeyId,
      secretAccessKey: accessToken.secretAccessKey,
      sessionToken: accessToken.sessionToken,
      accountId: accessToken.accountId,
      expiration: new Date(accessToken.expiresAt)
    };
  }
  get logger() {
    return this.init?.logger;
  }
  get loginSession() {
    return this.profileData.login_session;
  }
  async refresh(token) {
    let { SigninClient, CreateOAuth2TokenCommand } = await Promise.resolve().then(() => __toESM(require_signin(), 1)), { logger: logger2, userAgentAppId } = this.callerClientConfig ?? {}, requestHandler = ((requestHandler2) => {
      return requestHandler2?.metadata?.handlerProtocol === "h2";
    })(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler, region = this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION, client3 = new SigninClient({
      credentials: {
        accessKeyId: "",
        secretAccessKey: ""
      },
      region,
      requestHandler,
      logger: logger2,
      userAgentAppId,
      ...this.init?.clientConfig
    });
    this.createDPoPInterceptor(client3.middlewareStack);
    let commandInput = {
      tokenInput: {
        clientId: token.clientId,
        refreshToken: token.refreshToken,
        grantType: "refresh_token"
      }
    };
    try {
      let response2 = await client3.send(new CreateOAuth2TokenCommand(commandInput)), { accessKeyId, secretAccessKey, sessionToken } = response2.tokenOutput?.accessToken ?? {}, { refreshToken, expiresIn } = response2.tokenOutput ?? {};
      if (!accessKeyId || !secretAccessKey || !sessionToken || !refreshToken)
        throw new import_property_provider18.CredentialsProviderError("Token refresh response missing required fields", {
          logger: this.logger,
          tryNextLink: !1
        });
      let expiresInMs = (expiresIn ?? 900) * 1000, expiration = new Date(Date.now() + expiresInMs), updatedToken = {
        ...token,
        accessToken: {
          ...token.accessToken,
          accessKeyId,
          secretAccessKey,
          sessionToken,
          expiresAt: expiration.toISOString()
        },
        refreshToken
      };
      await this.saveToken(updatedToken);
      let newAccessToken = updatedToken.accessToken;
      return {
        accessKeyId: newAccessToken.accessKeyId,
        secretAccessKey: newAccessToken.secretAccessKey,
        sessionToken: newAccessToken.sessionToken,
        accountId: newAccessToken.accountId,
        expiration
      };
    } catch (error41) {
      if (error41.name === "AccessDeniedException") {
        let errorType = error41.error, message;
        switch (errorType) {
          case "TOKEN_EXPIRED":
            message = "Your session has expired. Please reauthenticate.";
            break;
          case "USER_CREDENTIALS_CHANGED":
            message = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
            break;
          case "INSUFFICIENT_PERMISSIONS":
            message = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
            break;
          default:
            message = `Failed to refresh token: ${String(error41)}. Please re-authenticate using \`aws login\``;
        }
        throw new import_property_provider18.CredentialsProviderError(message, { logger: this.logger, tryNextLink: !1 });
      }
      throw new import_property_provider18.CredentialsProviderError(`Failed to refresh token: ${String(error41)}. Please re-authenticate using aws login`, { logger: this.logger });
    }
  }
  async loadToken() {
    let tokenFilePath = this.getTokenFilePath();
    try {
      let tokenData;
      try {
        tokenData = await import_shared_ini_file_loader6.readFile(tokenFilePath, { ignoreCache: this.init?.ignoreCache });
      } catch {
        tokenData = await fs3.readFile(tokenFilePath, "utf8");
      }
      let token = JSON.parse(tokenData), missingFields = ["accessToken", "clientId", "refreshToken", "dpopKey"].filter((k) => !token[k]);
      if (!token.accessToken?.accountId)
        missingFields.push("accountId");
      if (missingFields.length > 0)
        throw new import_property_provider18.CredentialsProviderError(`Token validation failed, missing fields: ${missingFields.join(", ")}`, {
          logger: this.logger,
          tryNextLink: !1
        });
      return token;
    } catch (error41) {
      throw new import_property_provider18.CredentialsProviderError(`Failed to load token from ${tokenFilePath}: ${String(error41)}`, {
        logger: this.logger,
        tryNextLink: !1
      });
    }
  }
  async saveToken(token) {
    let tokenFilePath = this.getTokenFilePath(), directory = dirname11(tokenFilePath);
    try {
      await fs3.mkdir(directory, { recursive: !0 });
    } catch (error41) {}
    await fs3.writeFile(tokenFilePath, JSON.stringify(token, null, 2), "utf8");
  }
  getTokenFilePath() {
    let directory = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? join18(homedir9(), ".aws", "login", "cache"), loginSessionBytes = Buffer.from(this.loginSession, "utf8"), loginSessionSha256 = createHash("sha256").update(loginSessionBytes).digest("hex");
    return join18(directory, `${loginSessionSha256}.json`);
  }
  derToRawSignature(derSignature) {
    let offset = 2;
    if (derSignature[offset] !== 2)
      throw Error("Invalid DER signature");
    offset++;
    let rLength = derSignature[offset++], r = derSignature.subarray(offset, offset + rLength);
    if (offset += rLength, derSignature[offset] !== 2)
      throw Error("Invalid DER signature");
    offset++;
    let sLength = derSignature[offset++], s = derSignature.subarray(offset, offset + sLength);
    r = r[0] === 0 ? r.subarray(1) : r, s = s[0] === 0 ? s.subarray(1) : s;
    let rPadded = Buffer.concat([Buffer.alloc(32 - r.length), r]), sPadded = Buffer.concat([Buffer.alloc(32 - s.length), s]);
    return Buffer.concat([rPadded, sPadded]);
  }
  createDPoPInterceptor(middlewareStack) {
    middlewareStack.add((next) => async (args) => {
      if (HttpRequest2.isInstance(args.request)) {
        let request2 = args.request, actualEndpoint = `${request2.protocol}//${request2.hostname}${request2.port ? `:${request2.port}` : ""}${request2.path}`, dpop = await this.generateDpop(request2.method, actualEndpoint);
        request2.headers = {
          ...request2.headers,
          DPoP: dpop
        };
      }
      return next(args);
    }, {
      step: "finalizeRequest",
      name: "dpopInterceptor",
      override: !0
    });
  }
  async generateDpop(method = "POST", endpoint2) {
    let token = await this.loadToken();
    try {
      let privateKey = createPrivateKey({
        key: token.dpopKey,
        format: "pem",
        type: "sec1"
      }), publicDer = createPublicKey(privateKey).export({ format: "der", type: "spki" }), pointStart = -1;
      for (let i2 = 0;i2 < publicDer.length; i2++)
        if (publicDer[i2] === 4) {
          pointStart = i2;
          break;
        }
      let x2 = publicDer.slice(pointStart + 1, pointStart + 33), y = publicDer.slice(pointStart + 33, pointStart + 65), header = {
        alg: "ES256",
        typ: "dpop+jwt",
        jwk: {
          kty: "EC",
          crv: "P-256",
          x: x2.toString("base64url"),
          y: y.toString("base64url")
        }
      }, payload = {
        jti: crypto.randomUUID(),
        htm: method,
        htu: endpoint2,
        iat: Math.floor(Date.now() / 1000)
      }, headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url"), payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url"), message = `${headerB64}.${payloadB64}`, asn1Signature = sign("sha256", Buffer.from(message), privateKey), signatureB64 = this.derToRawSignature(asn1Signature).toString("base64url");
      return `${message}.${signatureB64}`;
    } catch (error41) {
      throw new import_property_provider18.CredentialsProviderError(`Failed to generate Dpop proof: ${error41 instanceof Error ? error41.message : String(error41)}`, { logger: this.logger, tryNextLink: !1 });
    }
  }
}
