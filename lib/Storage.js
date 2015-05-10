import Firebase from "firebase"
import Fireproof from "fireproof"
import Q from 'Q'

Fireproof.bless(Q)

let url = "https://bowwow.firebaseio.com"
let firebase = new Firebase(url)
let proof = new Fireproof(firebase)

export const firebaseRef = firebase
export default class Storage{
  setVideoTimestamp(timestamp){
    firebase.child("video/timestamp").set(timestamp)
  }
  getVideoTimestampPromise(){
    return proof.child("video/timestamp")
  }
}
