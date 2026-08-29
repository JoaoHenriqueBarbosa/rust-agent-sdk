// var: init_lib
var init_lib = __esm(() => {
  Diff.prototype = {
    diff: function(oldString, newString) {
      var _options$timeout, options2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, callback = options2.callback;
      if (typeof options2 === "function")
        callback = options2, options2 = {};
      var self2 = this;
      function done(value) {
        if (value = self2.postProcess(value, options2), callback)
          return setTimeout(function() {
            callback(value);
          }, 0), !0;
        else
          return value;
      }
      oldString = this.castInput(oldString, options2), newString = this.castInput(newString, options2), oldString = this.removeEmpty(this.tokenize(oldString, options2)), newString = this.removeEmpty(this.tokenize(newString, options2));
      var newLen = newString.length, oldLen = oldString.length, editLength = 1, maxEditLength = newLen + oldLen;
      if (options2.maxEditLength != null)
        maxEditLength = Math.min(maxEditLength, options2.maxEditLength);
      var maxExecutionTime = (_options$timeout = options2.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : 1 / 0, abortAfterTimestamp = Date.now() + maxExecutionTime, bestPath = [{
        oldPos: -1,
        lastComponent: void 0
      }], newPos = this.extractCommon(bestPath[0], newString, oldString, 0, options2);
      if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen)
        return done(buildValues(self2, bestPath[0].lastComponent, newString, oldString, self2.useLongestToken));
      var minDiagonalToConsider = -1 / 0, maxDiagonalToConsider = 1 / 0;
      function execEditLength() {
        for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength);diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
          var basePath = void 0, removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
          if (removePath)
            bestPath[diagonalPath - 1] = void 0;
          var canAdd = !1;
          if (addPath) {
            var addPathNewPos = addPath.oldPos - diagonalPath;
            canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
          }
          var canRemove = removePath && removePath.oldPos + 1 < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = void 0;
            continue;
          }
          if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos)
            basePath = self2.addToPath(addPath, !0, !1, 0, options2);
          else
            basePath = self2.addToPath(removePath, !1, !0, 1, options2);
          if (newPos = self2.extractCommon(basePath, newString, oldString, diagonalPath, options2), basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen)
            return done(buildValues(self2, basePath.lastComponent, newString, oldString, self2.useLongestToken));
          else {
            if (bestPath[diagonalPath] = basePath, basePath.oldPos + 1 >= oldLen)
              maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
            if (newPos + 1 >= newLen)
              minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
        editLength++;
      }
      if (callback)
        (function exec() {
          setTimeout(function() {
            if (editLength > maxEditLength || Date.now() > abortAfterTimestamp)
              return callback();
            if (!execEditLength())
              exec();
          }, 0);
        })();
      else
        while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
          var ret = execEditLength();
          if (ret)
            return ret;
        }
    },
    addToPath: function(path16, added, removed, oldPosInc, options2) {
      var last2 = path16.lastComponent;
      if (last2 && !options2.oneChangePerToken && last2.added === added && last2.removed === removed)
        return {
          oldPos: path16.oldPos + oldPosInc,
          lastComponent: {
            count: last2.count + 1,
            added,
            removed,
            previousComponent: last2.previousComponent
          }
        };
      else
        return {
          oldPos: path16.oldPos + oldPosInc,
          lastComponent: {
            count: 1,
            added,
            removed,
            previousComponent: last2
          }
        };
    },
    extractCommon: function(basePath, newString, oldString, diagonalPath, options2) {
      var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldString[oldPos + 1], newString[newPos + 1], options2))
        if (newPos++, oldPos++, commonCount++, options2.oneChangePerToken)
          basePath.lastComponent = {
            count: 1,
            previousComponent: basePath.lastComponent,
            added: !1,
            removed: !1
          };
      if (commonCount && !options2.oneChangePerToken)
        basePath.lastComponent = {
          count: commonCount,
          previousComponent: basePath.lastComponent,
          added: !1,
          removed: !1
        };
      return basePath.oldPos = oldPos, newPos;
    },
    equals: function(left, right, options2) {
      if (options2.comparator)
        return options2.comparator(left, right);
      else
        return left === right || options2.ignoreCase && left.toLowerCase() === right.toLowerCase();
    },
    removeEmpty: function(array3) {
      var ret = [];
      for (var i5 = 0;i5 < array3.length; i5++)
        if (array3[i5])
          ret.push(array3[i5]);
      return ret;
    },
    castInput: function(value) {
      return value;
    },
    tokenize: function(value) {
      return Array.from(value);
    },
    join: function(chars) {
      return chars.join("");
    },
    postProcess: function(changeObjects) {
      return changeObjects;
    }
  };
  characterDiff = new Diff;
  tokenizeIncludingWhitespace = new RegExp("[".concat(extendedWordChars, "]+|\\s+|[^").concat(extendedWordChars, "]"), "ug"), wordDiff = new Diff;
  wordDiff.equals = function(left, right, options2) {
    if (options2.ignoreCase)
      left = left.toLowerCase(), right = right.toLowerCase();
    return left.trim() === right.trim();
  };
  wordDiff.tokenize = function(value) {
    var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, parts;
    if (options2.intlSegmenter) {
      if (options2.intlSegmenter.resolvedOptions().granularity != "word")
        throw Error('The segmenter passed must have a granularity of "word"');
      parts = Array.from(options2.intlSegmenter.segment(value), function(segment) {
        return segment.segment;
      });
    } else
      parts = value.match(tokenizeIncludingWhitespace) || [];
    var tokens = [], prevPart = null;
    return parts.forEach(function(part) {
      if (/\s/.test(part))
        if (prevPart == null)
          tokens.push(part);
        else
          tokens.push(tokens.pop() + part);
      else if (/\s/.test(prevPart))
        if (tokens[tokens.length - 1] == prevPart)
          tokens.push(tokens.pop() + part);
        else
          tokens.push(prevPart + part);
      else
        tokens.push(part);
      prevPart = part;
    }), tokens;
  };
  wordDiff.join = function(tokens) {
    return tokens.map(function(token, i5) {
      if (i5 == 0)
        return token;
      else
        return token.replace(/^\s+/, "");
    }).join("");
  };
  wordDiff.postProcess = function(changes, options2) {
    if (!changes || options2.oneChangePerToken)
      return changes;
    var lastKeep = null, insertion = null, deletion = null;
    if (changes.forEach(function(change) {
      if (change.added)
        insertion = change;
      else if (change.removed)
        deletion = change;
      else {
        if (insertion || deletion)
          dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change);
        lastKeep = change, insertion = null, deletion = null;
      }
    }), insertion || deletion)
      dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null);
    return changes;
  };
  wordWithSpaceDiff = new Diff;
  wordWithSpaceDiff.tokenize = function(value) {
    var regex2 = new RegExp("(\\r?\\n)|[".concat(extendedWordChars, "]+|[^\\S\\n\\r]+|[^").concat(extendedWordChars, "]"), "ug");
    return value.match(regex2) || [];
  };
  lineDiff = new Diff;
  lineDiff.tokenize = function(value, options2) {
    if (options2.stripTrailingCr)
      value = value.replace(/\r\n/g, `
`);
    var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    if (!linesAndNewlines[linesAndNewlines.length - 1])
      linesAndNewlines.pop();
    for (var i5 = 0;i5 < linesAndNewlines.length; i5++) {
      var line = linesAndNewlines[i5];
      if (i5 % 2 && !options2.newlineIsToken)
        retLines[retLines.length - 1] += line;
      else
        retLines.push(line);
    }
    return retLines;
  };
  lineDiff.equals = function(left, right, options2) {
    if (options2.ignoreWhitespace) {
      if (!options2.newlineIsToken || !left.includes(`
`))
        left = left.trim();
      if (!options2.newlineIsToken || !right.includes(`
`))
        right = right.trim();
    } else if (options2.ignoreNewlineAtEof && !options2.newlineIsToken) {
      if (left.endsWith(`
`))
        left = left.slice(0, -1);
      if (right.endsWith(`
`))
        right = right.slice(0, -1);
    }
    return Diff.prototype.equals.call(this, left, right, options2);
  };
  sentenceDiff = new Diff;
  sentenceDiff.tokenize = function(value) {
    return value.split(/(\S.+?[.!?])(?=\s+|$)/);
  };
  cssDiff = new Diff;
  cssDiff.tokenize = function(value) {
    return value.split(/([{}:;,]|\s+)/);
  };
  jsonDiff = new Diff;
  jsonDiff.useLongestToken = !0;
  jsonDiff.tokenize = lineDiff.tokenize;
  jsonDiff.castInput = function(value, options2) {
    var { undefinedReplacement, stringifyReplacer: _options$stringifyRep } = options2, stringifyReplacer = _options$stringifyRep === void 0 ? function(k3, v2) {
      return typeof v2 > "u" ? undefinedReplacement : v2;
    } : _options$stringifyRep;
    return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
  };
  jsonDiff.equals = function(left, right, options2) {
    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"), options2);
  };
  arrayDiff = new Diff;
  arrayDiff.tokenize = function(value) {
    return value.slice();
  };
  arrayDiff.join = arrayDiff.removeEmpty = function(value) {
    return value;
  };
});
