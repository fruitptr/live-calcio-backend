// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD750J-KdGVhueMRkzmMn97Q2XbRj67oDU",
  authDomain: "live-calcio-fyp.firebaseapp.com",
  projectId: "live-calcio-fyp",
  storageBucket: "live-calcio-fyp.appspot.com",
  messagingSenderId: "824065313199",
  appId: "1:824065313199:web:41744e29a2bdde9c57c75a",
  measurementId: "G-S8CP9BZHJG"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);