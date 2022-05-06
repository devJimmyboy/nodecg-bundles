declare global {
  interface Window {
    webkitAudioContext: any;
    micAnalyser: AnalyserNode;
  }
}
navigator.mediaDevices.ondevicechange = (event) => {
  navigator.mediaDevices.enumerateDevices().then(updateDevice);
};
var dataArray: Uint8Array;
var deviceToUse: MediaDeviceInfo | null = null;
navigator.mediaDevices
  .enumerateDevices()
  .then(updateDevice)
  .then(() =>
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceToUse?.deviceId ?? "communications",
      },
      video: false,
    })
  )
  .then(handleMicStreamSuccess)
  .catch((e) => console.log("getting a microphone failed: ", e));

function handleMicStreamSuccess(stream: MediaStream) {
  var audioCtx = new AudioContext({ latencyHint: "interactive" });
  const source = audioCtx.createMediaStreamSource(stream);
  var analyser = audioCtx.createAnalyser();
  window.micAnalyser = analyser;
  source.connect(analyser);
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

export function getAudioData() {
  if (window.micAnalyser) {
    window.micAnalyser.getByteFrequencyData(dataArray);
    return dataArray;
  } else if (deviceToUse === null) {
    return dataArray;
  } else {
    console.debug("no mic analyser");
  }
}

function updateDevice(devices: MediaDeviceInfo[]) {
  deviceToUse = devices.find((dev) => dev.label.includes("Sample"));
}
