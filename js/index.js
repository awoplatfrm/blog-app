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
// REMOVE the old JWT token and fetch code entirely
// Add this clean version:

document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch("https://blog-app.infinityfree.me/?rest_route=/wp/v2/posts");

        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status}`);
        }

        const posts = await response.json();
        const postGrid = document.querySelector('.post-grid');

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
            '<p>Could not load posts. Please check connection.</p>';
    }
});

document.getElementById("sidebar-home-btn").addEventListener('click', () => {
    window.location.href = "/";
    return false
});
document.addEventListener("DOMContentLoaded", async () => {

    await fetch("https://blog-app.infinityfree.me/?rest_route=/wp/v2/posts", {
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    }).then(async (response) => {
        if (!response.ok) {
            //handle error
            throw new Error(`HTTP Error! with status code${response.status}`)

        }
        const posts = await response.json();
        const postGrid = document.querySelector('.post-grid');
        if (posts.length === 0) {
            postGrid.innerHTML = '<p>No posts available. <a href="../pages/createPost.html">Create a new post</a></p>';
        } else {
            posts.forEach(post => {
                // console.log("post id", post.id)
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    <h2>${post.title?.rendered || 'Untitled'}</h2>
                    <p>${post.content?.rendered || 'No content'}</p>
                    <div class="post-actions">
                    <button class="edit-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-btn" data-id="${post.id}">Delete</button>
                    </div>
                `;
                postGrid.appendChild(postElement);
            });
        }

    });

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
            fetch(`http://127.0.0.1/myproject2/wp-json/wp/v2/posts/${postId}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    "Authorization": `Bearer ${jwt_token}`,
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