// function: getCertEnvVarTelemetry
function getCertEnvVarTelemetry() {
  let result = {};
  if (process.env.NODE_EXTRA_CA_CERTS)
    result.has_node_extra_ca_certs = !0;
  if (process.env.CLAUDE_CODE_CLIENT_CERT)
    result.has_client_cert = !0;
  if (hasNodeOption("--use-system-ca"))
    result.has_use_system_ca = !0;
  if (hasNodeOption("--use-openssl-ca"))
    result.has_use_openssl_ca = !0;
  return result;
}
