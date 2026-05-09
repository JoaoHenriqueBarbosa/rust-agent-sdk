// Original: src/query/deps.ts
import { randomUUID as randomUUID17 } from "crypto";
function productionDeps() {
  return {
    callModel: queryModelWithStreaming,
    microcompact: microcompactMessages,
    autocompact: autoCompactIfNeeded,
    uuid: randomUUID17
  };
}
var init_deps = __esm(() => {
  init_claude();
  init_autoCompact();
  init_microCompact();
});
