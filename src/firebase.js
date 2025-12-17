// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpjF27sJeyC7AQGA7M7o9f2jeSHtUr3yo",
    authDomain: "letters2-7e774.firebaseapp.com",
    projectId: "letters2-7e774",
    storageBucket: "letters2-7e774.firebasestorage.app",
    messagingSenderId: "433331182630",
    appId: "1:433331182630:web:d5b57caa8fcf7f590a1ae7"
  };
  
// 1. 파이어베이스 앱 시작
const app = initializeApp(firebaseConfig);

// 2. 데이터베이스(Firestore) 기능만 쏙 뽑아서 내보내기
export const db = getFirestore(app);