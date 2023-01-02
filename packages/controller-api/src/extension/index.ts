// const ex = require("package")
import { NodeCG } from "nodecg-types/types/server";
// import { watch } from "fs/promises";
// import { readFile } from "fs/promises";
// import path from "path";

module.exports = function (nodecg: NodeCG) {
  // const log = nodecg.log;

  nodecg.listenFor("nodecgRestart", () => {
    process.exit(0);
  });

  // (async () => {
  //   const logFilePath = path.join(process.cwd(), "logs/nodecg.log");
  //   const watcher = watch(logFilePath);
  //   for await (const event of watcher) {
  //     if (event.eventType === "change") {
  //       await readFile(logFilePath, "utf8").then((data) => {
  //         let lines = data.split("\n");
  //         nodecg.sendMessage("stdout", lines.pop());
  //       });
  //     }
  //   }
  // })();
};
