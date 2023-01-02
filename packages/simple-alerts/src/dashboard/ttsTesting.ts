import "./config.css";
import $ from "jquery";

const defaultVoice = nodecg.Replicant<string>("defaultTTS");

const ttsVoice = $<HTMLInputElement>("#default-voice");
const ttsSound = $<HTMLAudioElement>("#tts");

const getTTS = (tts: string) =>
  nodecg.sendMessage("tts-process", tts, (err, ttsLink) => {
    if (err) return console.error(err);
    console.log(ttsLink);
    ttsSound.attr("src", ttsLink);
  });

ttsSound.on("load", () => {
  ttsSound.show();
});

$<HTMLButtonElement>("button#test").on("click", () => {
  const tts = $<HTMLInputElement>("#ttsText").val() as string;
  console.log("testing", tts);
  getTTS(tts);
});

NodeCG.waitForReplicants(defaultVoice).then(() => {
  ttsVoice.val(defaultVoice.value);
  ttsVoice.on("change", () => {
    defaultVoice.value = ttsVoice.val() as string;
  });
});
