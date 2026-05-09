// var: require_jwtaccess
var require_jwtaccess = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.JWTAccess = void 0;
  var jws = require_jws(), util_1 = require_util2(), DEFAULT_HEADER = {
    alg: "RS256",
    typ: "JWT"
  };

  class JWTAccess {
    constructor(email3, key, keyId, eagerRefreshThresholdMillis) {
      this.cache = new util_1.LRUCache({
        capacity: 500,
        maxAge: 3600000
      }), this.email = email3, this.key = key, this.keyId = keyId, this.eagerRefreshThresholdMillis = eagerRefreshThresholdMillis !== null && eagerRefreshThresholdMillis !== void 0 ? eagerRefreshThresholdMillis : 300000;
    }
    getCachedKey(url3, scopes) {
      let cacheKey = url3;
      if (scopes && Array.isArray(scopes) && scopes.length)
        cacheKey = url3 ? `${url3}_${scopes.join("_")}` : `${scopes.join("_")}`;
      else if (typeof scopes === "string")
        cacheKey = url3 ? `${url3}_${scopes}` : scopes;
      if (!cacheKey)
        throw Error("Scopes or url must be provided");
      return cacheKey;
    }
    getRequestHeaders(url3, additionalClaims, scopes) {
      let key = this.getCachedKey(url3, scopes), cachedToken = this.cache.get(key), now = Date.now();
      if (cachedToken && cachedToken.expiration - now > this.eagerRefreshThresholdMillis)
        return cachedToken.headers;
      let iat = Math.floor(Date.now() / 1000), exp = JWTAccess.getExpirationTime(iat), defaultClaims;
      if (Array.isArray(scopes))
        scopes = scopes.join(" ");
      if (scopes)
        defaultClaims = {
          iss: this.email,
          sub: this.email,
          scope: scopes,
          exp,
          iat
        };
      else
        defaultClaims = {
          iss: this.email,
          sub: this.email,
          aud: url3,
          exp,
          iat
        };
      if (additionalClaims) {
        for (let claim in defaultClaims)
          if (additionalClaims[claim])
            throw Error(`The '${claim}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`);
      }
      let header = this.keyId ? { ...DEFAULT_HEADER, kid: this.keyId } : DEFAULT_HEADER, payload = Object.assign(defaultClaims, additionalClaims), headers = { Authorization: `Bearer ${jws.sign({ header, payload, secret: this.key })}` };
      return this.cache.set(key, {
        expiration: exp * 1000,
        headers
      }), headers;
    }
    static getExpirationTime(iat) {
      return iat + 3600;
    }
    fromJSON(json2) {
      if (!json2)
        throw Error("Must pass in a JSON object containing the service account auth settings.");
      if (!json2.client_email)
        throw Error("The incoming JSON object does not contain a client_email field");
      if (!json2.private_key)
        throw Error("The incoming JSON object does not contain a private_key field");
      this.email = json2.client_email, this.key = json2.private_key, this.keyId = json2.private_key_id, this.projectId = json2.project_id;
    }
    fromStream(inputStream, callback) {
      if (callback)
        this.fromStreamAsync(inputStream).then(() => callback(), callback);
      else
        return this.fromStreamAsync(inputStream);
    }
    fromStreamAsync(inputStream) {
      return new Promise((resolve9, reject) => {
        if (!inputStream)
          reject(Error("Must pass in a stream containing the service account auth settings."));
        let s2 = "";
        inputStream.setEncoding("utf8").on("data", (chunk) => s2 += chunk).on("error", reject).on("end", () => {
          try {
            let data = JSON.parse(s2);
            this.fromJSON(data), resolve9();
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }
  exports.JWTAccess = JWTAccess;
});
