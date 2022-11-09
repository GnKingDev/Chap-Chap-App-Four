import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLYXuPnwENU6mgFHQIeGw5_j9x8CdB_dA",
  authDomain: "onlinezaly.firebaseapp.com",
  projectId: "onlinezaly",
  storageBucket: "onlinezaly.appspot.com",
  messagingSenderId: "978624818264",
  appId: "1:978624818264:web:ce0b64c6fb6f8a36f9ee2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app