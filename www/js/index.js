document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

const urlParam = new URLSearchParams(window.location.search);
const user = urlParam.get("user");
if (!user) {
    document.getElementById("login-btn").innerHTML = "Login";
} else {
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


// SMART API BASE SELECTOR
function getApiBase() {
    const hostname = window.location.hostname;

    // If on Vercel
    if (hostname.includes('vercel.app')) {
        return '/api/proxy/wp/v2';  // Use Vercel proxy
    }

    // If on GitHub Pages
    if (hostname.includes('github.io')) {
        return 'http://awoplatfrm-blog-app.atwebpages.com/wp-json/wp/v2';  // Direct (allowed)
    }

    // Local development (Cordova/localhost) - USE PROXY
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Use CORS proxy for local testing
        return 'https://corsproxy.io/?http://awoplatfrm-blog-app.atwebpages.com/wp-json/wp/v2';
    }

    // Default: Use Vercel-style proxy
    return '/api/proxy/wp/v2';
}


document.addEventListener("DOMContentLoaded", async () => {
    const loadingText = document.getElementById('loading-text');
    const postGrid = document.querySelector('.post-grid');

    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 15000);
        const cacheBuster = Date.now();
        const API_BASE = getApiBase();
        // 🎯 CORRECTED: Use direct /api/proxy/ without PROXY variable
        const response = await fetch(`${API_BASE}/posts?t=${cacheBuster}`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status}`);
        }

        const posts = await response.json();
        console.log("Posts loaded:", posts);
        loadingText.remove();

        if (posts.length === 0) {
            postGrid.innerHTML = '<p>No posts yet. <a href="pages/createPost.html">Create first post</a></p>';
        } else {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    ${post.title.rendered || 'Untitled'}
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
        loadingText.innerHTML = `
            Failed to load. 
            <button onclick="location.reload()" style="margin-left: 10px; padding: 5px 10px;">
                Retry
            </button>
            <br><small>${error.name === 'AbortError' ? 'Timeout' : error.message}</small>
        `;
    }
});

document.getElementById("sidebar-create-post-btn").addEventListener('click', () => {
    window.location.href = "pages/createPost.html";
    return false
});

// Edit and delete function
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const postId = e.target.dataset.id;
        window.location.href = `pages/editPage.html?id=${postId}`;
    }

    if (e.target.classList.contains('delete-btn')) {
        const postId = e.target.dataset.id;
        if (confirm('Do you want to delete this post?')) {
            const API_BASE = getApiBase();
            fetch(`${API_BASE}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    // 🚨 REMOVE HARDCODED TOKEN - Use localStorage
                    "Authorization": "Bearer " + localStorage.get("wp_token"),
                    "Content-Type": "application/json",
                }
            }).then(response => {
                if (response.ok) {
                    alert('Post deleted');
                    location.reload(true);
                } else {
                    throw new Error('Failed to delete post');
                }
            })
                .catch(error => console.error('Error deleting post:', error));
        }
    }
});