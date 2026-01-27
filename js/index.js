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

const WORDPRESS_API = "https://awoplatfrm-blog-app.atwebpages.com/wp-json/wp/v2";
;
document.addEventListener("DOMContentLoaded", async () => {

    const postGrid = document.querySelector('.post-grid');
    try {
        const response = await fetch(`${WORDPRESS_API}/posts`);

        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status}`);
        }

        const posts = await response.json();

        if (posts.length === 0) {
            postGrid.innerHTML = '<p>No posts yet. <a href="pages/createPost.html">Create first post</a></p>';
        } else {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    <h2>${post.title.rendered || 'Untitled'}</h2>
                    <div class="post-content">${post.content.rendered || 'No content'}</div>
                    <div class="post-actions">
                        <button class="edit-btn" data-id="${post.id}">Edit</button>
                        <button class="delete-btn" data-id="${post.id}">Delete</button>
                    </div>
                `;
                postGrid.appendChild(postElement);
            });
        }

    } catch (error) {
        console.error('Error:', error);
        document.querySelector('.post-grid').innerHTML =
            '<p>could not fetch posts</p>';
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