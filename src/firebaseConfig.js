import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage from Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCCybmLYEkXKajpTPfUbmKON6rV_YJXA44",
  authDomain: "amaya-capstone.firebaseapp.com",
  projectId: "amaya-capstone",
  storageBucket: "amaya-capstone.appspot.com",
  messagingSenderId: "974929070744",
  appId: "1:974929070744:web:cf4706eef496e7884c9eed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, firestore, storage }; // Export Firebase Storage along with other services
