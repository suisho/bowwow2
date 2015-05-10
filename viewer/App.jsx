import React from 'react'
import {firebaseRef} from "../lib/Storage"
import Bowwow from "./Bowwow.jsx"

export default class App extends React.Component{
  constructor(){
    super()
    this.state = {
      auth: null
    }
  }
  auth(){
    firebaseRef.authWithOAuthPopup("github", () => {
      console.log(arguments)
    })
  }
  componentDidMount(){
    firebaseRef.onAuth((authData) => {
      if(authData === null){
        this.auth()
        return
      }
      this.setState({
        auth: authData
      })
    })
  }
  renderElm(){
    if(!this.state.auth){
      return <span>Not Authorized</span>
    }
    return <Bowwow auth={this.state.auth}/>
  }
  render(){
    return <div>{this.renderElm()}</div>
  }
}