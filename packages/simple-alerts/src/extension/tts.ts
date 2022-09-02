import { Client } from "fakeyou.js";
import { NodeCG } from "nodecg-types/types/server";

const ttsLineRegex = /[a-zA-z]*:/g;

export default async function initTTS(nodecg: NodeCG) {
  const defaultTTS = nodecg.Replicant("defaultTTS", {
    defaultValue: "knuckles",
    persistent: true,
  });
  const fy = new Client({
    usernameOrEmail: "jimmydv6@yahoo.com",
    password: process.env.FAKEYOU_PASSWORD,
  });
  await fy.start();
  nodecg.listenFor(
    "tts-process",
    async (txt, cb: { (ttsLink: Buffer | string): void; handled: boolean }) => {
      const tts = await onTTS(txt);
      if (cb.handled) return;
      else cb(tts);
    }
  );
  const onTTS = async (text: string) => {
    const matches = text.matchAll(ttsLineRegex);
    let prevIndex = 0;
    for (const match of matches) {
      const line = match[0];
      const index = match.index;
      const startNextLine = ttsLineRegex.lastIndex;
      const textStart = index + line.length;
      const modelName = text.slice(prevIndex, index + line[0].length);
      const txt = text.slice(prevIndex, index);
      prevIndex = index + 1;
      console.dir({
        modelName,
        txt,
        index,
        startNextLine,
        textStart,
      });
      const searchedModels = fy.searchModel(modelName);
      const model = searchedModels.first();
      if (model) {
        const tts = await model.request(txt);
        return tts.audioURL();
      } else return;
    }
  };

  return fy;
}
