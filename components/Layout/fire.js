import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyDKDi7cfb9-MQtr-S_JpXfMoTZSgGLdm18",
  authDomain: "xyzcoder.firebaseapp.com",
  databaseURL: "https://xyzcoder-887ac.firebaseio.com"
};
var fire = firebase.initializeApp(config);
export default fire;