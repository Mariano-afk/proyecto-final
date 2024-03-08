import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = ({
    apiKey: "AIzaSyCT7JDQ6HTR91ivGl9tQfnCXD6d013095g",
    authDomain: "dteca-17eb0.firebaseapp.com",
    projectId: "dteca-17eb0",
    storageBucket: "dteca-17eb0.appspot.com",
    messagingSenderId: "48897772295",
    appId: "1:48897772295:web:71d29dab092145508653a2"
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig)
var storageRef = firebase.storage().ref();

export { db, storageRef };
