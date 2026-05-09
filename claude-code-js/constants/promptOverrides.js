// Original: src/constants/promptOverrides.ts
import { readFileSync as readFileSync9 } from "fs";
import { resolve as resolve9 } from "path";
import { homedir as homedir11 } from "os";
function getPromptOverrides() {
  if (!_config)
    try {
      let raw = JSON.parse(readFileSync9(CONFIG_PATH, "utf-8"));
      _config = { ...DEFAULTS, ...raw };
    } catch {
      _config = { ...DEFAULTS };
    }
  return _config;
}
function promptToggle(key, original, override = "") {
  return getPromptOverrides()[key] ? original : override;
}
var DEFAULTS, CONFIG_PATH, _config = null;
var init_promptOverrides = __esm(() => {
  DEFAULTS = {
    cyberRisk: !0,
    fileReadMalware: !0,
    urlRestriction: !0,
    actionConfirmation: !0,
    gitSafety: !0,
    gitSafetyAnt: !0,
    sandboxStrict: !0,
    commitSafety: !0,
    commitPushPrSafety: !0,
    webFetchCopyright: !0,
    softwareEngineeringOnly: !0,
    forceConcise: !0,
    emojiRestriction: !0
  }, CONFIG_PATH = resolve9(homedir11(), ".claude", "promptOverrides.json");
});

// node_modules/ignore/index.js
var require_ignore = __commonJS((exports, module) => {
  function makeArray(subject) {
    return Array.isArray(subject) ? subject : [subject];
  }
  var UNDEFINED = void 0, EMPTY2 = "", SPACE = " ", ESCAPE = "\\", REGEX_TEST_BLANK_LINE = /^\s+$/, REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/, REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/, REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/, REGEX_SPLITALL_CRLF = /\r?\n/g, REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/, REGEX_TEST_TRAILING_SLASH = /\/$/, SLASH = "/", TMP_KEY_IGNORE = "node-ignore";
  if (typeof Symbol < "u")
    TMP_KEY_IGNORE = Symbol.for("node-ignore");
  var KEY_IGNORE = TMP_KEY_IGNORE, define2 = (object2, key, value) => {
    return Object.defineProperty(object2, key, { value }), value;
  }, REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g, RETURN_FALSE = () => !1, sanitizeRange = (range) => range.replace(REGEX_REGEXP_RANGE, (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY2), cleanRangeBackSlash = (slashes) => {
    let { length } = slashes;
    return slashes.slice(0, length - length % 2);
  }, REPLACERS = [
    [
      /^\uFEFF/,
      () => EMPTY2
    ],
    [
      /((?:\\\\)*?)(\\?\s+)$/,
      (_, m1, m22) => m1 + (m22.indexOf("\\") === 0 ? SPACE : EMPTY2)
    ],
    [
      /(\\+?)\s/g,
      (_, m1) => {
        let { length } = m1;
        return m1.slice(0, length - length % 2) + SPACE;
      }
    ],
    [
      /[\\$.|*+(){^]/g,
      (match) => `\\${match}`
    ],
    [
      /(?!\\)\?/g,
      () => "[^/]"
    ],
    [
      /^\//,
      () => "^"
    ],
    [
      /\//g,
      () => "\\/"
    ],
    [
      /^\^*\\\*\\\*\\\//,
      () => "^(?:.*\\/)?"
    ],
    [
      /^(?=[^^])/,
      function() {
        return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
      }
    ],
    [
      /\\\/\\\*\\\*(?=\\\/|$)/g,
      (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
    ],
    [
      /(^|[^\\]+)(\\\*)+(?=.+)/g,
      (_, p1, p22) => {
        let unescaped = p22.replace(/\\\*/g, "[^\\/]*");
        return p1 + unescaped;
      }
    ],
    [
      /\\\\\\(?=[$.|*+(){^])/g,
      () => ESCAPE
    ],
    [
      /\\\\/g,
      () => ESCAPE
    ],
    [
      /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
      (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
    ],
    [
      /(?:[^*])$/,
      (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
    ]
  ], REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/, MODE_IGNORE = "regex", MODE_CHECK_IGNORE = "checkRegex", UNDERSCORE = "_", TRAILING_WILD_CARD_REPLACERS = {
    [MODE_IGNORE](_, p1) {
      return `${p1 ? `${p1}[^/]+` : "[^/]*"}(?=$|\\/$)`;
    },
    [MODE_CHECK_IGNORE](_, p1) {
      return `${p1 ? `${p1}[^/]*` : "[^/]*"}(?=$|\\/$)`;
    }
  }, makeRegexPrefix = (pattern) => REPLACERS.reduce((prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)), pattern), isString2 = (subject) => typeof subject === "string", checkPattern = (pattern) => pattern && isString2(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0, splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF).filter(Boolean);

  class IgnoreRule {
    constructor(pattern, mark, body, ignoreCase, negative, prefix) {
      this.pattern = pattern, this.mark = mark, this.negative = negative, define2(this, "body", body), define2(this, "ignoreCase", ignoreCase), define2(this, "regexPrefix", prefix);
    }
    get regex() {
      let key = UNDERSCORE + MODE_IGNORE;
      if (this[key])
        return this[key];
      return this._make(MODE_IGNORE, key);
    }
    get checkRegex() {
      let key = UNDERSCORE + MODE_CHECK_IGNORE;
      if (this[key])
        return this[key];
      return this._make(MODE_CHECK_IGNORE, key);
    }
    _make(mode, key) {
      let str = this.regexPrefix.replace(REGEX_REPLACE_TRAILING_WILDCARD, TRAILING_WILD_CARD_REPLACERS[mode]), regex2 = this.ignoreCase ? new RegExp(str, "i") : new RegExp(str);
      return define2(this, key, regex2);
    }
  }
  var createRule = ({
    pattern,
    mark
  }, ignoreCase) => {
    let negative = !1, body = pattern;
    if (body.indexOf("!") === 0)
      negative = !0, body = body.substr(1);
    body = body.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
    let regexPrefix = makeRegexPrefix(body);
    return new IgnoreRule(pattern, mark, body, ignoreCase, negative, regexPrefix);
  };

  class RuleManager {
    constructor(ignoreCase) {
      this._ignoreCase = ignoreCase, this._rules = [];
    }
    _add(pattern) {
      if (pattern && pattern[KEY_IGNORE]) {
        this._rules = this._rules.concat(pattern._rules._rules), this._added = !0;
        return;
      }
      if (isString2(pattern))
        pattern = {
          pattern
        };
      if (checkPattern(pattern.pattern)) {
        let rule = createRule(pattern, this._ignoreCase);
        this._added = !0, this._rules.push(rule);
      }
    }
    add(pattern) {
      return this._added = !1, makeArray(isString2(pattern) ? splitPattern(pattern) : pattern).forEach(this._add, this), this._added;
    }
    test(path12, checkUnignored, mode) {
      let ignored = !1, unignored = !1, matchedRule;
      this._rules.forEach((rule) => {
        let { negative } = rule;
        if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored)
          return;
        if (!rule[mode].test(path12))
          return;
        ignored = !negative, unignored = negative, matchedRule = negative ? UNDEFINED : rule;
      });
      let ret = {
        ignored,
        unignored
      };
      if (matchedRule)
        ret.rule = matchedRule;
      return ret;
    }
  }
  var throwError = (message, Ctor) => {
    throw new Ctor(message);
  }, checkPath = (path12, originalPath, doThrow) => {
    if (!isString2(path12))
      return doThrow(`path must be a string, but got \`${originalPath}\``, TypeError);
    if (!path12)
      return doThrow("path must not be empty", TypeError);
    if (checkPath.isNotRelative(path12))
      return doThrow(`path should be a \`path.relative()\`d string, but got "${originalPath}"`, RangeError);
    return !0;
  }, isNotRelative = (path12) => REGEX_TEST_INVALID_PATH.test(path12);
  checkPath.isNotRelative = isNotRelative;
  checkPath.convert = (p4) => p4;

  class Ignore {
    constructor({
      ignorecase = !0,
      ignoreCase = ignorecase,
      allowRelativePaths = !1
    } = {}) {
      define2(this, KEY_IGNORE, !0), this._rules = new RuleManager(ignoreCase), this._strictPathCheck = !allowRelativePaths, this._initCache();
    }
    _initCache() {
      this._ignoreCache = Object.create(null), this._testCache = Object.create(null);
    }
    add(pattern) {
      if (this._rules.add(pattern))
        this._initCache();
      return this;
    }
    addPattern(pattern) {
      return this.add(pattern);
    }
    _test(originalPath, cache4, checkUnignored, slices) {
      let path12 = originalPath && checkPath.convert(originalPath);
      return checkPath(path12, originalPath, this._strictPathCheck ? throwError : RETURN_FALSE), this._t(path12, cache4, checkUnignored, slices);
    }
    checkIgnore(path12) {
      if (!REGEX_TEST_TRAILING_SLASH.test(path12))
        return this.test(path12);
      let slices = path12.split(SLASH).filter(Boolean);
      if (slices.pop(), slices.length) {
        let parent = this._t(slices.join(SLASH) + SLASH, this._testCache, !0, slices);
        if (parent.ignored)
          return parent;
      }
      return this._rules.test(path12, !1, MODE_CHECK_IGNORE);
    }
    _t(path12, cache4, checkUnignored, slices) {
      if (path12 in cache4)
        return cache4[path12];
      if (!slices)
        slices = path12.split(SLASH).filter(Boolean);
      if (slices.pop(), !slices.length)
        return cache4[path12] = this._rules.test(path12, checkUnignored, MODE_IGNORE);
      let parent = this._t(slices.join(SLASH) + SLASH, cache4, checkUnignored, slices);
      return cache4[path12] = parent.ignored ? parent : this._rules.test(path12, checkUnignored, MODE_IGNORE);
    }
    ignores(path12) {
      return this._test(path12, this._ignoreCache, !1).ignored;
    }
    createFilter() {
      return (path12) => !this.ignores(path12);
    }
    filter(paths2) {
      return makeArray(paths2).filter(this.createFilter());
    }
    test(path12) {
      return this._test(path12, this._testCache, !0);
    }
  }
  var factory2 = (options) => new Ignore(options), isPathValid = (path12) => checkPath(path12 && checkPath.convert(path12), path12, RETURN_FALSE), setupWindows = () => {
    let makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
    checkPath.convert = makePosix;
    let REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
    checkPath.isNotRelative = (path12) => REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path12) || isNotRelative(path12);
  };
  if (typeof process < "u" && process.platform === "win32")
    setupWindows();
  module.exports = factory2;
  factory2.default = factory2;
  module.exports.isPathValid = isPathValid;
  define2(module.exports, Symbol.for("setupWindows"), setupWindows);
});

// node_modules/tree-kill/index.js
var require_tree_kill = __commonJS((exports, module) => {
  var childProcess3 = __require("child_process"), spawn2 = childProcess3.spawn, exec3 = childProcess3.exec;
  module.exports = function(pid, signal, callback) {
    if (typeof signal === "function" && callback === void 0)
      callback = signal, signal = void 0;
    if (pid = parseInt(pid), Number.isNaN(pid))
      if (callback)
        return callback(Error("pid must be a number"));
      else
        throw Error("pid must be a number");
    var tree = {}, pidsToProcess = {};
    switch (tree[pid] = [], pidsToProcess[pid] = 1, process.platform) {
      case "win32":
        exec3("taskkill /pid " + pid + " /T /F", callback);
        break;
      case "darwin":
        buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
          return spawn2("pgrep", ["-P", parentPid]);
        }, function() {
          killAll(tree, signal, callback);
        });
        break;
      default:
        buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
          return spawn2("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid]);
        }, function() {
          killAll(tree, signal, callback);
        });
        break;
    }
  };
  function killAll(tree, signal, callback) {
    var killed = {};
    try {
      Object.keys(tree).forEach(function(pid) {
        if (tree[pid].forEach(function(pidpid) {
          if (!killed[pidpid])
            killPid(pidpid, signal), killed[pidpid] = 1;
        }), !killed[pid])
          killPid(pid, signal), killed[pid] = 1;
      });
    } catch (err) {
      if (callback)
        return callback(err);
      else
        throw err;
    }
    if (callback)
      return callback();
  }
  function killPid(pid, signal) {
    try {
      process.kill(parseInt(pid, 10), signal);
    } catch (err) {
      if (err.code !== "ESRCH")
        throw err;
    }
  }
  function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
    var ps = spawnChildProcessesList(parentPid), allData = "";
    ps.stdout.on("data", function(data) {
      var data = data.toString("ascii");
      allData += data;
    });
    var onClose = function(code) {
      if (delete pidsToProcess[parentPid], code != 0) {
        if (Object.keys(pidsToProcess).length == 0)
          cb();
        return;
      }
      allData.match(/\d+/g).forEach(function(pid) {
        pid = parseInt(pid, 10), tree[parentPid].push(pid), tree[pid] = [], pidsToProcess[pid] = 1, buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
      });
    };
    ps.on("close", onClose);
  }
});
