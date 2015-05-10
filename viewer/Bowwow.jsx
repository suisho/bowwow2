import React from 'react'
import Storage from "../lib/Storage"

var storage = new Storage()
export default class Bowwow extends React.Component{
  constructor(){
    super()
    // Todo: to store
    storage.getVideoTimestampPromise().then((s)=> {
      console.log(s.val())
    })
  }
  render(){
    const {username, email} = this.props.auth.github
    return <div>
      Hello {username} ({email})
    </div>
  }
}
