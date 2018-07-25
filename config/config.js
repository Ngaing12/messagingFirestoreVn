import * as firebase from "firebase";
require("firebase/firestore");
const firebaseConfig = {
 apiKey: "AIzaSyB8EvhHUTVksaVSuWVIfcjcVONoQzc2d-M",
 authDomain: "messaging-vn.firebaseapp.com",
 databaseURL: "https://messaging-vn.firebaseio.com",
 projectId: "messaging-vn",
 storageBucket: "messaging-vn.appspot.com",
 messagingSenderId: "402523891875"
};
const settings={
  timestampsInSnapshots:true
};
firebase.initializeApp(firebaseConfig);
 const firestore=firebase.firestore();
firestore.settings(settings);
export default firestore;
