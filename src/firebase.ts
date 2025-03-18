import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, Database } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4oEubGYrbU3l8JgIpk7joasE4rJT7dMo",
  authDomain: "edusmartclassroom-5f511.firebaseapp.com",
  databaseURL: "https://edusmartclassroom-5f511-default-rtdb.firebaseio.com",
  projectId: "edusmartclassroom-5f511",
  storageBucket: "edusmartclassroom-5f511.firebasestorage.app",
  messagingSenderId: "85998120917",
  appId: "1:85998120917:web:2a8cb57126a01962d9575c",
  measurementId: "G-GM3P9978KR"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

export { database, ref, set, onValue };
