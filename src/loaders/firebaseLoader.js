// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBkSBqm7hX4l-AMcgRclj99BnYU3c2oGT4',
    authDomain: 'login-a5c4d.firebaseapp.com',
    projectId: 'login-a5c4d',
    storageBucket: 'login-a5c4d.appspot.com',
    messagingSenderId: '221908195357',
    appId: '1:221908195357:web:89b83cdf39f1900e898ef4',
    measurementId: 'G-CMN7Q5WSLH',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
