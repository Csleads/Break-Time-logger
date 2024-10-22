// Include Firebase scripts (via CDN)
document.write('<script src="https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js"></script>');
document.write('<script src="https://www.gstatic.com/firebasejs/9.4.0/firebase-analytics.js"></script>');
document.write('<script src="https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js"></script>');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2UPYjU85Yam4aN1cvA0GTsoWQ5RMoLjo",
    authDomain: "breaktimer-bb662.firebaseapp.com",
    projectId: "breaktimer-bb662",
    storageBucket: "breaktimer-bb662.appspot.com",
    messagingSenderId: "691709998367",
    appId: "1:691709998367:web:84b94b1540ffcd71286c2a",
    measurementId: "G-TX1ZJSTPNW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const database = firebase.database();  // Initialize Realtime Database
