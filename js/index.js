document.addEventListener('deviceready', onDeviceReady, false);

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// auth.createUserWithEmailAndPassword(auth, email, password)

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
}

const urlParam = new URLSearchParams(window.location.search);
const user = urlParam.get("user");
// console.log("user", user);
if (!user) {
    document.getElementById("login-btn").innerHTML = "Login";

}
else {
    document.getElementById("login-btn").innerHTML = `welcome back ${user.split(" ")[1]}`

}
document.getElementById("login-btn").addEventListener("click", () => {
    console.log("login btn clicked");
    window.location.href = "pages/loginPage.html";
    return false;

})
document.getElementById("sidebar-login-btn").addEventListener('click', () => {
    console.log("login button clicked")
    window.location.href = "pages/loginPage.html";
    return false

});

const WORDPRESS_API = "https://blog-app.infinityfree.me/index.php/wp-json/wp/v2";
document.addEventListener("DOMContentLoaded", async () => {

    const postGrid = document.querySelector('.post-grid');
    try {
        console.log("Fetching from:", `${WORDPRESS_API}/posts`);

        const response = await fetch(`${WORDPRESS_API}/posts`);

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        // Check if we got HTML instead of JSON
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            const html = await response.text();
            console.error("Got HTML error page:", html.substring(0, 500));
            throw new Error("WordPress returned HTML instead of JSON");
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const posts = await response.json();
        console.log("Posts received:", posts.length, "posts");

        // Rest of your code...

    } catch (error) {
        console.error('Full error:', error);
        document.querySelector('.post-grid').innerHTML =
            `<p>Error: ${error.message}. Check console.</p>`;
    }
});

document.getElementById("sidebar-home-btn").addEventListener('click', () => {
    window.location.href = "/";
    return false
});
// edit and delete function
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const postId = e.target.dataset.id;
        // Handle edit
        window.location.href = `pages/editPage.html?id=${postId}`
        // console.log('Edit post:', postId);
    }
    if (e.target.classList.contains('delete-btn')) {
        const postId = e.target.dataset.id;
        if (confirm('do you want to delete this post?')) {
            fetch(`${WORDPRESS_API}/${postId}`, {
                method: 'DELETE',
                headers: {
                    "content-type": "application/json",
                }
            }).then(response => {
                if (response.ok) {
                    alert('Post deleted');
                    location.reload();
                } else {
                    throw new Error('Failed to delete post');
                }
            })
                .catch(error => console.error('Error deleting post:', error));
        }
    }
});