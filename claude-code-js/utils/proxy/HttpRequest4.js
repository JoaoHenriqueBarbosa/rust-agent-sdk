// class: HttpRequest4
class HttpRequest4 {
  method;
  protocol;
  hostname;
  port;
  path;
  query;
  headers;
  username;
  password;
  fragment;
  body;
  constructor(options) {
    this.method = options.method || "GET", this.hostname = options.hostname || "localhost", this.port = options.port, this.query = options.query || {}, this.headers = options.headers || {}, this.body = options.body, this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:", this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/", this.username = options.username, this.password = options.password, this.fragment = options.fragment;
  }
  static clone(request2) {
    let cloned = new HttpRequest4({
      ...request2,
      headers: { ...request2.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery4(cloned.query);
    return cloned;
  }
  static isInstance(request2) {
    if (!request2)
      return !1;
    let req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req.query === "object" && typeof req.headers === "object";
  }
  clone() {
    return HttpRequest4.clone(this);
  }
}
