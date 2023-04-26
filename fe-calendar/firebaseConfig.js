// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBS9wmuSJ6zPs3QIsFSbZueRLNkj-Nk918",
    authDomain: "dulcet-coast-383615.firebaseapp.com",
    projectId: "dulcet-coast-383615",
    storageBucket: "dulcet-coast-383615.appspot.com",
    messagingSenderId: "217109832798",
    appId: "1:217109832798:web:6c1efaada06c86820380cf",
    measurementId: "G-Q7Q21FG390"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider}
