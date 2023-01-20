
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC5PRaY30ntL_cWpkySUTqAzzM8pL5VnOg",
  authDomain: "depixen-ee108.firebaseapp.com",
  projectId: "depixen-ee108",
  storageBucket: "depixen-ee108.appspot.com",
  messagingSenderId: "431341895154",
  appId: "1:431341895154:web:6f6e9ecef71a84a63cff6b",
  measurementId: "G-PXP8KY17F3"
};

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app);