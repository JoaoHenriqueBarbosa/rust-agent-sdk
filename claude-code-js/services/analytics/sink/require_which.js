// var: require_which
var require_which = __commonJS((exports, module) => {
  var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", path2 = __require("path"), COLON = isWindows ? ";" : ":", isexe = require_isexe(), getNotFoundError = (cmd) => Object.assign(Error(`not found: ${cmd}`), { code: "ENOENT" }), getPathInfo = (cmd, opt) => {
    let colon = opt.colon || COLON, pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
      ...isWindows ? [process.cwd()] : [],
      ...(opt.path || process.env.PATH || "").split(colon)
    ], pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", pathExt = isWindows ? pathExtExe.split(colon) : [""];
    if (isWindows) {
      if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
        pathExt.unshift("");
    }
    return {
      pathEnv,
      pathExt,
      pathExtExe
    };
  }, which = (cmd, opt, cb) => {
    if (typeof opt === "function")
      cb = opt, opt = {};
    if (!opt)
      opt = {};
    let { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt), found = [], step = (i) => new Promise((resolve2, reject) => {
      if (i === pathEnv.length)
        return opt.all && found.length ? resolve2(found) : reject(getNotFoundError(cmd));
      let ppRaw = pathEnv[i], pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw, pCmd = path2.join(pathPart, cmd), p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      resolve2(subStep(p, i, 0));
    }), subStep = (p, i, ii) => new Promise((resolve2, reject) => {
      if (ii === pathExt.length)
        return resolve2(step(i + 1));
      let ext = pathExt[ii];
      isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
        if (!er && is)
          if (opt.all)
            found.push(p + ext);
          else
            return resolve2(p + ext);
        return resolve2(subStep(p, i, ii + 1));
      });
    });
    return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
  }, whichSync = (cmd, opt) => {
    opt = opt || {};
    let { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt), found = [];
    for (let i = 0;i < pathEnv.length; i++) {
      let ppRaw = pathEnv[i], pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw, pCmd = path2.join(pathPart, cmd), p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      for (let j = 0;j < pathExt.length; j++) {
        let cur = p + pathExt[j];
        try {
          if (isexe.sync(cur, { pathExt: pathExtExe }))
            if (opt.all)
              found.push(cur);
            else
              return cur;
        } catch (ex) {}
      }
    }
    if (opt.all && found.length)
      return found;
    if (opt.nothrow)
      return null;
    throw getNotFoundError(cmd);
  };
  module.exports = which;
  which.sync = whichSync;
});
