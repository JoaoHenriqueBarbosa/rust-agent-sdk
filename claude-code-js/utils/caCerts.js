// Original: src/utils/caCerts.ts
function clearCACertsCache() {
  getCACertificates.cache.clear?.(), logForDebugging("Cleared CA certificates cache");
}
var getCACertificates;
var init_caCerts = __esm(() => {
  init_memoize();
  init_debug();
  init_envUtils();
  init_fsOperations();
  getCACertificates = memoize_default(() => {
    let useSystemCA = hasNodeOption("--use-system-ca") || hasNodeOption("--use-openssl-ca"), extraCertsPath = process.env.NODE_EXTRA_CA_CERTS;
    if (logForDebugging(`CA certs: useSystemCA=${useSystemCA}, extraCertsPath=${extraCertsPath}`), !useSystemCA && !extraCertsPath)
      return;
    let tls = __require("tls"), certs = [];
    if (useSystemCA) {
      let getCACerts = tls.getCACertificates, systemCAs = getCACerts?.("system");
      if (systemCAs && systemCAs.length > 0)
        certs.push(...systemCAs), logForDebugging(`CA certs: Loaded ${certs.length} system CA certificates (--use-system-ca)`);
      else if (!getCACerts && !extraCertsPath) {
        logForDebugging("CA certs: --use-system-ca set but system CA API unavailable, deferring to runtime");
        return;
      } else
        certs.push(...tls.rootCertificates), logForDebugging(`CA certs: Loaded ${certs.length} bundled root certificates as base (--use-system-ca fallback)`);
    } else
      certs.push(...tls.rootCertificates), logForDebugging(`CA certs: Loaded ${certs.length} bundled root certificates as base`);
    if (extraCertsPath)
      try {
        let extraCert = getFsImplementation().readFileSync(extraCertsPath, {
          encoding: "utf8"
        });
        certs.push(extraCert), logForDebugging(`CA certs: Appended extra certificates from NODE_EXTRA_CA_CERTS (${extraCertsPath})`);
      } catch (error41) {
        logForDebugging(`CA certs: Failed to read NODE_EXTRA_CA_CERTS file (${extraCertsPath}): ${error41}`, { level: "error" });
      }
    return certs.length > 0 ? certs : void 0;
  });
});
