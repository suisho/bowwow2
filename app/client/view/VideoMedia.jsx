import React from 'react'

import {resemble} from 'resemblejs'
  
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
    return <video ref="video" style={{opacity: 0}} />
  }
}

class VideoCanvas extends React.Component{
  constructor(){
    super()
    this.state = {
      width : 320,
      height: 320 * 2/3
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
  }
  getCanvasSize(video){
    let videoAspect = video.clientHeight / video.clientWidth
    let ctxWidth = 320
    let ctxHeight = ctxWidth * videoAspect
    return {width: ctxWidth, height: ctxHeight}
  }
  render(){
    return <canvas ref="canvas"
      width={this.state.width}
      height={this.state.height}/>
  }
}

export default class VideoMedia extends React.Component{
  constructor(e){
    super()
    this.lastTimeStamp = new Date().getTime()
    this.state = {
      video: null,
      videoTimeDiff: 0
    }
  }
  onVideoChange(e){
    // console.log(e.timeStamp)
    this.setState({
      video: e.target,
      videoTimeDiff: e.timeStamp - this.lastTimeStamp
    })
    this.lastTimeStamp = e.timeStamp
  }
  render(){
    return (
      <div>
        <div>{this.state.videoTimeDiff}</div>
        <VideoCanvas video={this.state.video} />
        <VideoLoader onTimeUpdated={this.onVideoChange.bind(this)} />
      </div>
    )
  }
}