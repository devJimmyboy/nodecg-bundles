declare global {
  interface Window {
    webkitAudioContext: any
    micAnalyser: AnalyserNode
  }
}

var dataArray: Uint8Array
navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then(handleMicStreamSuccess)
  .catch((e) => console.log("getting a microphone failed: ", e))

function handleMicStreamSuccess(stream: MediaStream) {
  var audioCtx = new AudioContext()
  const source = audioCtx.createMediaStreamSource(stream)
  var analyser = audioCtx.createAnalyser()
  window.micAnalyser = analyser
  source.connect(analyser)
  analyser.fftSize = 2048
  var bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)
}

export function getAudioData() {
  if (window.micAnalyser) {
    window.micAnalyser.getByteFrequencyData(dataArray)
    return dataArray
  } else {
    // console.error("no mic analyser")
  }
}
