// var: init_processUtils
var init_processUtils = __esm(() => {
  processUtils = {
    execFile(file2, params, options) {
      return new Promise((resolve9, reject) => {
        childProcess2.execFile(file2, params, options, (error43, stdout, stderr) => {
          if (Buffer.isBuffer(stdout))
            stdout = stdout.toString("utf8");
          if (Buffer.isBuffer(stderr))
            stderr = stderr.toString("utf8");
          if (stderr || error43)
            reject(stderr ? Error(stderr) : error43);
          else
            resolve9(stdout);
        });
      });
    }
  };
});
