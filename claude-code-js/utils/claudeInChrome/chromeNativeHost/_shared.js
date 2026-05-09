// Shared module state and imports
// Original: src/utils/claudeInChrome/chromeNativeHost.ts
__export(exports_chromeNativeHost, {
  sendChromeMessage: () => sendChromeMessage,
  runChromeNativeHost: () => runChromeNativeHost
});
import {
  appendFile as appendFile5,
  chmod as chmod11,
  mkdir as mkdir40,
  readdir as readdir29,
  rmdir as rmdir3,
  stat as stat42,
  unlink as unlink22
} from "fs/promises";
import { createServer as createServer7 } from "net";
import { platform as platform6 } from "os";
import { join as join139 } from "path";



// node_modules/commander/lib/error.js

// node_modules/commander/lib/argument.js

// node_modules/commander/lib/help.js

// node_modules/commander/lib/option.js

// node_modules/commander/lib/suggestSimilar.js

// node_modules/commander/lib/command.js

// node_modules/commander/index.js

// node_modules/@commander-js/extra-typings/index.js

// node_modules/@commander-js/extra-typings/esm.mjs
var import__3, program, createCommand, createArgument, createOption, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Command5, Argument, Option, Help;

