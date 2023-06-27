import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();
import { getStorage } from "firebase/storage";
import { get } from "mongoose";
const firebaseConfig = {
    apiKey: "AIzaSyB7CGIrP1VUQUeNKk2ApgDvPkCgh5gjbQ8",
    authDomain: "taghub-41c71.firebaseapp.com",
    projectId: "taghub-41c71",
    storageBucket: "taghub-41c71.appspot.com",
    messagingSenderId: "667218637465",
    appId: "1:667218637465:web:d06397abbedf59f7493e08",
    measurementId: "G-LJPLC1VHXP"
};

// Export the initialized Firebase app instance

const app = initializeApp(firebaseConfig);

// Export specific Firebase modules if needed
export const firebaseStorage = getStorage(app);
