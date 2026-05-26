import { initializeApp } from "firebase/app";

import {
  getAuth
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBKaRurw49RCD504E9-us5VurE8ph2obOA",

  authDomain: "lmsed-b3cd0.firebaseapp.com",

  projectId: "lmsed-b3cd0",

  storageBucket: "lmsed-b3cd0.firebasestorage.app",

  messagingSenderId: "650140253485",

  appId: "1:650140253485:web:f14ec68e0686ea463267a4"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);