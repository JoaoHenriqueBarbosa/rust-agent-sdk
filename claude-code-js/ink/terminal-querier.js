// Original: src/ink/terminal-querier.ts
function xtversion() {
  return {
    request: csi(">0q"),
    match: (r4) => r4.type === "xtversion"
  };
}

class TerminalQuerier {
  stdout;
  queue = [];
  constructor(stdout) {
    this.stdout = stdout;
  }
  send(query) {
    return new Promise((resolve10) => {
      this.queue.push({
        kind: "query",
        match: query.match,
        resolve: (r4) => resolve10(r4)
      }), this.stdout.write(query.request);
    });
  }
  flush() {
    return new Promise((resolve10) => {
      this.queue.push({ kind: "sentinel", resolve: resolve10 }), this.stdout.write(SENTINEL);
    });
  }
  onResponse(r4) {
    let idx = this.queue.findIndex((p4) => p4.kind === "query" && p4.match(r4));
    if (idx !== -1) {
      let [q4] = this.queue.splice(idx, 1);
      if (q4?.kind === "query")
        q4.resolve(r4);
      return;
    }
    if (r4.type === "da1") {
      let s2 = this.queue.findIndex((p4) => p4.kind === "sentinel");
      if (s2 === -1)
        return;
      for (let p4 of this.queue.splice(0, s2 + 1))
        if (p4.kind === "query")
          p4.resolve(void 0);
        else
          p4.resolve();
    }
  }
}
var SENTINEL;
var init_terminal_querier = __esm(() => {
  init_csi();
  init_osc();
  SENTINEL = csi("c");
});
