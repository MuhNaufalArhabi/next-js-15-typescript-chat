// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2NLdXUjhR-0dIioDEojGEXNsxEgPZSWo",
  authDomain: "chat-nextjs-91948.firebaseapp.com",
  databaseURL: "https://chat-nextjs-91948-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-nextjs-91948",
  storageBucket: "chat-nextjs-91948.firebasestorage.app",
  messagingSenderId: "458462631022",
  appId: "1:458462631022:web:4ac3e270fdd70f510ec27f",
  measurementId: "G-D0XWL4C53Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
