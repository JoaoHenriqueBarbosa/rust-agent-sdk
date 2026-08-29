// function: generateProxyEnvVars
function generateProxyEnvVars(httpProxyPort, socksProxyPort) {
  let envVars = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR || "/tmp/claude"}`];
  if (!httpProxyPort && !socksProxyPort)
    return envVars;
  let noProxyAddresses = [
    "localhost",
    "127.0.0.1",
    "::1",
    "*.local",
    ".local",
    "169.254.0.0/16",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16"
  ].join(",");
  if (envVars.push(`NO_PROXY=${noProxyAddresses}`), envVars.push(`no_proxy=${noProxyAddresses}`), httpProxyPort)
    envVars.push(`HTTP_PROXY=http://localhost:${httpProxyPort}`), envVars.push(`HTTPS_PROXY=http://localhost:${httpProxyPort}`), envVars.push(`http_proxy=http://localhost:${httpProxyPort}`), envVars.push(`https_proxy=http://localhost:${httpProxyPort}`);
  if (socksProxyPort) {
    envVars.push(`ALL_PROXY=socks5h://localhost:${socksProxyPort}`), envVars.push(`all_proxy=socks5h://localhost:${socksProxyPort}`);
    let platform3 = getPlatform2();
    if (platform3 === "macos")
      envVars.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${socksProxyPort} %h %p'`);
    else if (platform3 === "linux" && httpProxyPort)
      envVars.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='socat - PROXY:localhost:%h:%p,proxyport=${httpProxyPort}'`);
    if (envVars.push(`FTP_PROXY=socks5h://localhost:${socksProxyPort}`), envVars.push(`ftp_proxy=socks5h://localhost:${socksProxyPort}`), envVars.push(`RSYNC_PROXY=localhost:${socksProxyPort}`), envVars.push(`DOCKER_HTTP_PROXY=http://localhost:${httpProxyPort || socksProxyPort}`), envVars.push(`DOCKER_HTTPS_PROXY=http://localhost:${httpProxyPort || socksProxyPort}`), httpProxyPort)
      envVars.push("CLOUDSDK_PROXY_TYPE=https"), envVars.push("CLOUDSDK_PROXY_ADDRESS=localhost"), envVars.push(`CLOUDSDK_PROXY_PORT=${httpProxyPort}`);
    envVars.push(`GRPC_PROXY=socks5h://localhost:${socksProxyPort}`), envVars.push(`grpc_proxy=socks5h://localhost:${socksProxyPort}`);
  }
  return envVars;
}
