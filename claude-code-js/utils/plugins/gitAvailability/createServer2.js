// function: createServer2
function createServer2(opts) {
  let server = new Socks5Server;
  if (opts?.auth)
    server.setAuthHandler((conn) => {
      return conn.username === opts.auth.username && conn.password === opts.auth.password;
    });
  if (opts?.port)
    server.listen(opts.port, opts.hostname);
  return server;
}
