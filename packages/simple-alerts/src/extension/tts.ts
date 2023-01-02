// import { Client } from "fakeyou.js";
import { load } from "cheerio";
import { NodeCG } from "nodecg-types/types/server";
import axios from "axios";

const uberduck = axios.create({
  baseURL: "https://api.uberduck.ai/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  auth: {
    username: process.env["UBERDUCK_API_KEY"] as string,
    password: process.env["UBERDUCK_API_SECRET"] as string,
  },
});

const ttsLineRegex = /[a-zA-Z]*:/g;

const reqUberduck = async (character: string, text: string) => {
  const { data } = await uberduck.post("/speak", {
    voice: character,
    pace: 1,
    speech: text,
  });
  let done = false;
  while (!done) {
    const status = (
      await uberduck.get("/speak-status", {
        params: { uuid: data.uuid },
      })
    ).data;
    if (status.finished_at) {
      done = true;
      return status.path as string;
    } else if (status.failed_at) {
      done = true;
      return undefined;
    } else {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

const voices: UberduckVoice[] = [];

export default async function initTTS(nodecg: NodeCG) {
  const defaultTTS = nodecg.Replicant("defaultTTS", {
    defaultValue: "15ai-spongebob",
    persistent: true,
  });
  defaultTTS.on("change", (old,newVal) => {
    nodecg.log.info("Voice changed from", old, "to", newVal)
  })
  const { data: voiceResp } = await uberduck.get<UberduckVoice[]>("/voices", {
    params: {
      mode: "tts-basic"
    },
  });
  voices.push(...voiceResp);

  // const fy = new Client({
  //   usernameOrEmail: "jimmydv6@yahoo.com",
  // });
  // await fy.start().catch((e) => {
  //   nodecg.log.error(e);
  // });
  nodecg.listenFor("tts-process", async (txt: string, cb) => {
    nodecg.log.info("Processing TTS: " + txt);
    const tts = await onTTS(txt).catch((e) => {
      if (cb.handled === true) return;
      cb(e);
    });
    nodecg.log.info("TTS: " + tts);
    if (cb.handled === true) return;
    else cb(null, tts);
  });
  const onTTS = async (text: string) => {
    const matches = text.split(":");
    let modelName = defaultTTS.value;
    let txt = text;
    if (matches.length >= 2) {
      modelName = matches[0].trim();
      txt = matches[1].trim();
    }

    // console.dir({
    //   modelName,
    //   txt,
    // });
    nodecg.log.info("Voices: ", voices.length)
    const searchedModel = voices.find(
      (v) => v.name.toLowerCase() === modelName.toLowerCase()
    );
    if (searchedModel) {
      //TODO: Add Uberduck support
      const tts = await reqUberduck(modelName, txt);
      return tts;
    } else {
      nodecg.log.info("Voice not found")
      return "";
    }
  };

  const router = nodecg.Router({});
  router.get("/tts/run", async (req, res) => {
    const { voice, text } = req.query;
    if (!voice || !text) {
      res.status(400).send("Missing voice or text");
      return;
    }
    nodecg.log.info('Processing TTS: "' + text + '" with voice ' + voice);
    const tts = await onTTS(`${voice}: ${text}`);
    res.send(tts);
  });
  router.get("/tts", async (req, res) => {
    const $ = load(`
      <input type="text" id="voice" placeholder="Voice" />
      <input type="text" id="text" placeholder="Text" />
      <button id="submit">Submit</button>
      <div id="result"></div>
    `);
    $("head")
      .append(
        $(
          `<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>`
        )
      )
      .append(
        $(
          `<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" integrity="sha256-lSjKY0/srUM9BE3dPm+c4fBo1dky2v27Gdjm2uoZaL0=" crossorigin="anonymous"></script>`
        )
      )
      .append(
        $(
          `<link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css">`
        )
      );
    $("body").append(
      $(`<script type="application/javascript">
        window.voices = ${JSON.stringify(
          voices.map((v) => ({
            label: v.display_name,
            value: v.name,
          }))
        )};
        
        const voice = $("#voice");
        const text = $("#text");
        const submit = $("#submit");
        const result = $("#result");
        const audio = $("<audio controls></audio>").appendTo(result).hide();
        voice.autocomplete({
          source: voices,
        });

        submit.on("click", () => {
          fetch('/tts/run?voice=' + voice.val() + '&text=' + text.val()).then((r) => r.text()).then((t) => {
            audio.show()
            audio.attr("src", t);
          })
        })
      </script>`)
    );
    res.send($.html());
  });
  nodecg.mount(router);
  // return fy;
}

interface UberduckVoice {
  architecture: string;
  category: string;
  contributors: string[];
  controls: boolean;
  display_name: string;
  is_active: boolean;
  model_id: string;
  memberships: any[];
  is_private: boolean;
  is_primary: boolean;
  name: string;
  symbol_set: string;
  voicemodel_uuid: string;
  hifi_gan_vocoder: string;
  ml_model_id: number;
  speaker_id: any;
  language: string;
}
