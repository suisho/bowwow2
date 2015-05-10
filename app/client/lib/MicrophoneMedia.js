import EventEmitter from 'eventemitter3';

/* global webkitAudioContext */
class MicrophoneMedia extends EventEmitter{
  constructor(nav){
    this.navigator = nav
    this.audioContext = new webkitAudioContext()
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1)

    this.navigator.webkitGetUserMedia(
      { video: true, audio: true},
      this.onSuccess.bind(this),
      this.onFail.bind(this)
    )
  }
  onFail(err){
    console.error(err)
  }
  onSuccess(stream){
    this.stream = stream
    this.setupAudio(stream)
  }
  generateAnalyser(){
    let analyser = this.audioContext.createAnalyser()
    analyser.smoothingTimeConstant = 0.3
    analyser.fftSize = 1024
    return analyser
  }
  generateMicrophone(stream){
    return this.audioContext.createMediaStreamSource(stream)
  }
  setupAudio(stream){
    let microphone = this.generateMicrophone(stream)
    let analyser = this.generateAnalyser()
    microphone.connect(analyser)
    analyser.connect(this.javascriptNode)
    this.javascriptNode.connect(this.audioContext.destination)
    this.setupJavascriptNode(analyser)
  }
  setupJavascriptNode(analyser){
    this.javascriptNode.onaudioprocess = (err) => {
      if(err){
        console.error(err)
        return
      }
      var freq = new Uint8Array(analyser.frequencyBinCount)
      var times = new Uint8Array(analyser.fftSize)
      analyser.getByteFrequencyData(freq)
      analyser.getByteTimeDomainData(times)
      this.setState({
        freq: freq,
        times: times
      })
    }
  }
  setState(state){
    this.state = state
  }
}
