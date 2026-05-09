// Shared module state and imports
// Original: src/utils/fsOperations.ts
import * as fs from "fs";
import {
  mkdir as mkdirPromise,
  open,
  readdir as readdirPromise,
  readFile as readFilePromise,
  rename as renamePromise,
  rmdir as rmdirPromise,
  rm as rmPromise,
  stat as statPromise,
  unlink as unlinkPromise
} from "fs/promises";
import { homedir as homedir2 } from "os";
import * as nodePath from "path";
async function* readLinesReverse(path2) {
  let fileHandle = await open(path2, "r");
  try {
    let position = (await fileHandle.stat()).size, remainder = Buffer.alloc(0), buffer = Buffer.alloc(4096);
    while (position > 0) {
      let currentChunkSize = Math.min(4096, position);
      position -= currentChunkSize, await fileHandle.read(buffer, 0, currentChunkSize, position);
      let combined = Buffer.concat([
        buffer.subarray(0, currentChunkSize),
        remainder
      ]), firstNewline = combined.indexOf(10);
      if (firstNewline === -1) {
        remainder = combined;
        continue;
      }
      remainder = Buffer.from(combined.subarray(0, firstNewline));
      let lines = combined.toString("utf8", firstNewline + 1).split(`
`);
      for (let i = lines.length - 1;i >= 0; i--) {
        let line = lines[i];
        if (line)
          yield line;
      }
    }
    if (remainder.length > 0)
      yield remainder.toString("utf8");
  } finally {
    await fileHandle.close();
  }
}
var NodeFsOperations, activeFs;

