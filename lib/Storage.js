import Firebase from "firebase"
let url = "https://bowwow.firebaseio.com"
let firebase = new Firebase(url)

export default class Storage{
  setVideoTimestamp(timestamp){
    firebase.child("video/timestamp").set(timestamp)
  }
}
