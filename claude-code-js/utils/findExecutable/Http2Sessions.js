// class: Http2Sessions
class Http2Sessions {
  constructor() {
    this.sessions = Object.create(null);
  }
  getSession(authority, options) {
    options = Object.assign({
      sessionTimeout: 1000
    }, options);
    let authoritySessions = this.sessions[authority];
    if (authoritySessions) {
      let len = authoritySessions.length;
      for (let i2 = 0;i2 < len; i2++) {
        let [sessionHandle, sessionOptions] = authoritySessions[i2];
        if (!sessionHandle.destroyed && !sessionHandle.closed && util2.isDeepStrictEqual(sessionOptions, options))
          return sessionHandle;
      }
    }
    let session = http2.connect(authority, options), removed, removeSession = () => {
      if (removed)
        return;
      removed = !0;
      let entries = authoritySessions, len = entries.length, i2 = len;
      while (i2--)
        if (entries[i2][0] === session) {
          if (len === 1)
            delete this.sessions[authority];
          else
            entries.splice(i2, 1);
          if (!session.closed)
            session.close();
          return;
        }
    }, originalRequestFn = session.request, { sessionTimeout } = options;
    if (sessionTimeout != null) {
      let timer, streamsCount = 0;
      session.request = function() {
        let stream4 = originalRequestFn.apply(this, arguments);
        if (streamsCount++, timer)
          clearTimeout(timer), timer = null;
        return stream4.once("close", () => {
          if (!--streamsCount)
            timer = setTimeout(() => {
              timer = null, removeSession();
            }, sessionTimeout);
        }), stream4;
      };
    }
    session.once("close", removeSession);
    let entry = [session, options];
    return authoritySessions ? authoritySessions.push(entry) : authoritySessions = this.sessions[authority] = [entry], session;
  }
}
