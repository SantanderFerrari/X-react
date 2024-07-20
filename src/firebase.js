// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-react-b3e2b.firebaseapp.com",
  projectId: "x-react-b3e2b",
  storageBucket: "x-react-b3e2b.appspot.com",
  messagingSenderId: "846185420451",
  appId: "1:846185420451:web:9c9fb4ba23a07e766e5116"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);