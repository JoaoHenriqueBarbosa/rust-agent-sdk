// function: configureGlobalMTLS
function configureGlobalMTLS() {
  if (!getMTLSConfig())
    return;
  if (process.env.NODE_EXTRA_CA_CERTS)
    logForDebugging("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs");
}
