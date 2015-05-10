import React from 'react'
import Storage from '../../../lib/Storage'
import {resemble} from 'resemblejs'

let storage = new Storage()

class VideoLoader extends React.Component{
  node(){
    return this.refs.video.getDOMNode()
  }
  componentDidMount(){
    // set event
    let videoNode = this.node()
    videoNode.addEventListener('timeupdate', this.onTimeUpdated.bind(this))

    // load navigator
    window.navigator.webkitGetUserMedia(
      { video: true, audio: true},
      this.onMediaSuccess.bind(this),
      this.onMediaFail.bind(this)
    )
  }
  onTimeUpdated(ev){
    this.props.onTimeUpdated(ev)
  }
  onMediaSuccess(stream){
    let videoNode = this.node()
    videoNode.src = window.URL.createObjectURL(stream)
    videoNode.volume = 0
    videoNode.play()
  }
  onMediaFail(err){
    console.error(err)
  }
  render(){
    return <video ref="video" style={{opacity: this.props.debug ? 1 : 0}} />
  }
}

class VideoCanvas extends React.Component{
  constructor(){
    super()
    this.state = {
      width : 0,
      height: 0
    }
  }
  node(){
    return this.refs.canvas.getDOMNode()
  }
  componentWillReceiveProps(){
    if(!this.props.video){
      return
    }
    this.renderVideo(this.props.video)
  }
  renderVideo(video){
    let canvas = this.node()
    let {width, height} = this.getCanvasSize(video)
    this.setState({
      width: width,
      height: height
    })
    canvas.getContext("2d").drawImage(
      this.props.video,
      0, 0, video.clientWidth, video.clientHeight,
      0, 0, width, height
    )
    this.diffImage()
  }
  captureImage(){
    return this.node().toDataURL("image/jpeg")
  }
  isValidImage(image){
    // TODO: this is very adhoc
    if(!image) return false
    if(image === "data:,") return false
    return true
  }
  diffImage(){
    let capture = this.captureImage()
    if(this.isValidImage(capture) === false){
      return
    }
    if(this.lastCapture === undefined){
      this.lastCapture = capture
    }
    let diff = resemble(this.lastCapture).compareTo(capture)
            .ignoreColors()
    diff.onComplete((data) => {
      this.props.onImageDiff(data)
    })

    this.lastCapture = capture
  }
  getCanvasSize(video){
    let videoAspect = video.clientHeight / video.clientWidth
    let ctxWidth = 320
    let ctxHeight = ctxWidth * videoAspect
    return {width: ctxWidth, height: ctxHeight}
  }
  render(){
    return <canvas ref="canvas"
      style={{opacity: this.props.debug ? 1 : 0}}
      width={this.state.width}
      height={this.state.height}/>
  }
}

export default class VideoMedia extends React.Component{
  constructor(e){
    super()
    this.lastTimeStamp = new Date().getTime()
    this.imageDiff = null
    this.state = {
      video: null,
      videoTimeDiff: 0,
    }
    this.setTimer()
  }
  setTimer(){
    setInterval(() => {
      if(!this.imageDiff) return
      console.log(this.imageDiff.length)
    }, 500)
  }
  onVideoChange(e){
    // console.log(e.timeStamp)
    this.setState({
      video: e.target,
      videoTimeDiff: e.timeStamp - this.lastTimeStamp
    })
    // storage.setVideoTimestamp(e.timeStamp)
    this.lastTimeStamp = e.timeStamp
  }
  onImageDiff(data){
    this.imageDiff = data.getImageDataUrl()
    // console.log(data.misMatchPercentage)
  }
  imageDiffElm(diff){
    return diff ? <img src={diff} /> : null
  }
  render(){
    let imgElm = this.imageDiffElm(this.imageDiff)
    let debug=0
    return (
      <div>
        <div>{this.state.videoTimeDiff}</div>
        {imgElm}
        <VideoCanvas
          video={this.state.video}
          onImageDiff={this.onImageDiff.bind(this)}
          debug={debug}
        />
      <VideoLoader debug={debug} onTimeUpdated={this.onVideoChange.bind(this)} />
      </div>
    )
  }
}