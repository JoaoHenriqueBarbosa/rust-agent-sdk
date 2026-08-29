// var: init_fsOperations
var init_fsOperations = __esm(() => {
  init_errors();
  init_slowOperations();
  NodeFsOperations = {
    cwd() {
      return process.cwd();
    },
    existsSync(fsPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.existsSync(${fsPath})`, 0);
        return fs.existsSync(fsPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    async stat(fsPath) {
      return statPromise(fsPath);
    },
    async readdir(fsPath) {
      return readdirPromise(fsPath, { withFileTypes: !0 });
    },
    async unlink(fsPath) {
      return unlinkPromise(fsPath);
    },
    async rmdir(fsPath) {
      return rmdirPromise(fsPath);
    },
    async rm(fsPath, options) {
      return rmPromise(fsPath, options);
    },
    async mkdir(dirPath, options) {
      try {
        await mkdirPromise(dirPath, { recursive: !0, ...options });
      } catch (e) {
        if (getErrnoCode(e) !== "EEXIST")
          throw e;
      }
    },
    async readFile(fsPath, options) {
      return readFilePromise(fsPath, { encoding: options.encoding });
    },
    async rename(oldPath, newPath) {
      return renamePromise(oldPath, newPath);
    },
    statSync(fsPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.statSync(${fsPath})`, 0);
        return fs.statSync(fsPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    lstatSync(fsPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.lstatSync(${fsPath})`, 0);
        return fs.lstatSync(fsPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readFileSync(fsPath, options) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readFileSync(${fsPath})`, 0);
        return fs.readFileSync(fsPath, { encoding: options.encoding });
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readFileBytesSync(fsPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readFileBytesSync(${fsPath})`, 0);
        return fs.readFileSync(fsPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readSync(fsPath, options) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readSync(${fsPath}, ${options.length} bytes)`, 0);
        let fd = void 0;
        try {
          fd = fs.openSync(fsPath, "r");
          let buffer = Buffer.alloc(options.length), bytesRead = fs.readSync(fd, buffer, 0, options.length, 0);
          return { buffer, bytesRead };
        } finally {
          if (fd)
            fs.closeSync(fd);
        }
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    appendFileSync(path2, data, options) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.appendFileSync(${path2}, ${data.length} chars)`, 0);
        if (options?.mode !== void 0)
          try {
            let fd = fs.openSync(path2, "ax", options.mode);
            try {
              fs.appendFileSync(fd, data);
            } finally {
              fs.closeSync(fd);
            }
            return;
          } catch (e) {
            if (getErrnoCode(e) !== "EEXIST")
              throw e;
          }
        fs.appendFileSync(path2, data);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    copyFileSync(src, dest) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.copyFileSync(${src} \u2192 ${dest})`, 0);
        fs.copyFileSync(src, dest);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    unlinkSync(path2) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.unlinkSync(${path2})`, 0);
        fs.unlinkSync(path2);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    renameSync(oldPath, newPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.renameSync(${oldPath} \u2192 ${newPath})`, 0);
        fs.renameSync(oldPath, newPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    linkSync(target, path2) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.linkSync(${target} \u2192 ${path2})`, 0);
        fs.linkSync(target, path2);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    symlinkSync(target, path2, type) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.symlinkSync(${target} \u2192 ${path2})`, 0);
        fs.symlinkSync(target, path2, type);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readlinkSync(path2) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readlinkSync(${path2})`, 0);
        return fs.readlinkSync(path2);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    realpathSync(path2) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.realpathSync(${path2})`, 0);
        return fs.realpathSync(path2).normalize("NFC");
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    mkdirSync(dirPath, options) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.mkdirSync(${dirPath})`, 0);
        let mkdirOptions = {
          recursive: !0
        };
        if (options?.mode !== void 0)
          mkdirOptions.mode = options.mode;
        try {
          fs.mkdirSync(dirPath, mkdirOptions);
        } catch (e) {
          if (getErrnoCode(e) !== "EEXIST")
            throw e;
        }
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readdirSync(dirPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readdirSync(${dirPath})`, 0);
        return fs.readdirSync(dirPath, { withFileTypes: !0 });
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    readdirStringSync(dirPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.readdirStringSync(${dirPath})`, 0);
        return fs.readdirSync(dirPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    isDirEmptySync(dirPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.isDirEmptySync(${dirPath})`, 0);
        let files = this.readdirSync(dirPath);
        return files.length === 0;
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    rmdirSync(dirPath) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.rmdirSync(${dirPath})`, 0);
        fs.rmdirSync(dirPath);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    rmSync(path2, options) {
      let __stack = [];
      try {
        const _ = __using(__stack, slowLogging`fs.rmSync(${path2})`, 0);
        fs.rmSync(path2, options);
      } catch (_catch) {
        var _err = _catch, _hasErr = 1;
      } finally {
        __callDispose(__stack, _err, _hasErr);
      }
    },
    createWriteStream(path2) {
      return fs.createWriteStream(path2);
    },
    async readFileBytes(fsPath, maxBytes) {
      if (maxBytes === void 0)
        return readFilePromise(fsPath);
      let handle = await open(fsPath, "r");
      try {
        let { size } = await handle.stat(), readSize = Math.min(size, maxBytes), buffer = Buffer.allocUnsafe(readSize), offset = 0;
        while (offset < readSize) {
          let { bytesRead } = await handle.read(buffer, offset, readSize - offset, offset);
          if (bytesRead === 0)
            break;
          offset += bytesRead;
        }
        return offset < readSize ? buffer.subarray(0, offset) : buffer;
      } finally {
        await handle.close();
      }
    }
  }, activeFs = NodeFsOperations;
});
