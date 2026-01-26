
document.addEventListener('deviceready', onDeviceReady, false);
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "../pages/loginPage.html";
    return false
});

const firebaseConfig = {
    apiKey: "AIzaSyAfhjFFwlxGeaUHIiZ2hrLBM1tG4lSSNFQ",
    authDomain: "blogproject-8c489.firebaseapp.com",
    projectId: "blogproject-8c489",
    storageBucket: "blogproject-8c489.firebasestorage.app",
    messagingSenderId: "598225454905",
    appId: "1:598225454905:web:1b2db5ed4af63f8d424ae8",
    // measurementId: "G-J1WK92LWCC"
};

let app, db, auth;
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    if (typeof firebase !== "undefined") {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        setSignUpForm();

    } else {
        console.log("Firebase not loaded");
    }
    // document.getElementById('deviceready').classList.add('ready');
}

function setSignUpForm() {
    const signUpForId = document.getElementById("signup-form");
    if (signUpForId) {
        signUpForId.addEventListener("submit", signupForm)
    }
}

async function signupForm(e) {
    e.preventDefault();
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm_password = document.getElementById("confirm-password").value.trim();

    if (fullname !== '' && email !== '' && password.length >= 6 && confirm_password.length >= 6) {
        //continue with password compared
        if (password !== confirm_password) {
            alert("password do not match")
        }
        try {


            const userCredential = await auth.createUserWithEmailAndPassword(email, password)
            const user = userCredential.user;
            await user.updateProfile({
                displayName: fullname
            });

            await db.collection("user").doc(user.uid).set({
                uid: user.uid,
                fullname: fullname,
                email: email,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("account created successful");

            window.location.href = '../pages/loginPage.html';

        } catch (error) {
            alert("error during signup", error)
        }

    } else {
        //throw error
        alert("please fill all the required field and password must be at least 6 character long")
    }
}