import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_hZyfMN7w0Tol-Hq7ZGPzMtquSh7tFy4",
  authDomain: "crime-database-management.firebaseapp.com",
  projectId: "crime-database-management",
  storageBucket: "crime-database-management.firebasestorage.app",
  messagingSenderId: "770270512130",
  appId: "1:770270512130:web:78afffd5c4163cdd20d31b",
  measurementId: "G-FKTCN2KFP9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
