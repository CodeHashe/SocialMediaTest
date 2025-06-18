import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCBtEKUOTZQkgggjYHSHWhrUOdkjqk0vRw",
  authDomain: "vetra-e7e88.firebaseapp.com",
  projectId: "vetra-e7e88",
  storageBucket: "vetra-e7e88.appspot.com", 
  messagingSenderId: "72269166028",
  appId: "1:72269166028:web:4afc3704c25e391e665969"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
