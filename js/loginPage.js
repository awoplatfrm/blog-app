// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
document.getElementById("signup-btn").addEventListener("click", () => {
    window.location.href = "../pages/signupPage.html";
    return false
})

// Firebase configuration - use global script instead of imports
var firebaseConfig = {
    apiKey: "AIzaSyAfhjFFwlxGeaUHIiZ2hrLBM1tG4lSSNFQ",
    authDomain: "blogproject-8c489.firebaseapp.com",
    projectId: "blogproject-8c489",
    storageBucket: "blogproject-8c489.firebasestorage.app",
    messagingSenderId: "598225454905",
    appId: "1:598225454905:web:1b2db5ed4af63f8d424ae8",
    // measurementId: "G-J1WK92LWCC"
};

// Firebase will be initialized after deviceready
let app, db, auth;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // Initialize Firebase after Cordova is ready
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        // analytics = firebase.analytics();
        auth = firebase.auth();
        // db = firebase.firestore()

        setSignupForm();

    } else {
        console.error('Firebase not loaded!');
    };

    // document.getElementById('deviceready').classList.add('ready');
}

function setSignupForm() {
    const formID = document.getElementById("login-form");
    if (formID) {
        formID.addEventListener("submit", handleLogin);
    };
}

// function initUI() {
//     // Setup button click events
//     const homeBtn = document.getElementById('home-btn');
//     if (homeBtn) {
//         homeBtn.addEventListener('click', () => {
//             window.location.href = "index.html"; // Use relative path
//         });
//     }

//     // Setup login form if exists
//     const loginForm = document.getElementById('login-form');
//     if (loginForm) {
//         loginForm.addEventListener('submit', handleLogin);
//     }
// }

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (email !== "" && password !== "") {
        console.log("login clicked")
        const res = await auth.signInWithEmailAndPassword(email, password);
        console.log("user login successfull", res.user.displayName);
        window.location.href = `../index.html?user=${res.user.displayName}`

    } else {
        alert("all field must be fill")
    }

}

document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = "../index.html";
    return false

});