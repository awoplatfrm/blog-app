
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}


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


const urlParams = new URLSearchParams(window.location.search);
// const PROXY = "https://corsproxy.io/?";
// const WORDPRESS_BASE = "http:///api/proxy/wp/v2";


document.addEventListener("DOMContentLoaded", async () => {
    const postId = urlParams.get('id');
    console.log("Edit Post ID:", postId);

    // Debug: Test API URL
    // const testUrl = `${PROXY}${encodeURIComponent(WORDPRESS_BASE + '/posts/' + postId)}`;
    // console.log("API URL:", testUrl);
    const base_url = getApiBase();

    try {
        const response = await fetch(`${base_url}/posts/${postId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXdvcGxhdGZybS1ibG9nLWFwcC5hdHdlYnBhZ2VzLmNvbSIsImlhdCI6MTc3MDYwMTMxNiwibmJmIjoxNzcwNjAxMzE2LCJleHAiOjE3NzEyMDYxMTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.cP4u5JvkBY_dmG2XgCjtU8klrW43OTQmi7JKqTMUVjE",
                "Content-Type": "application/json",
            }
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`HTTP ${response.status}`);
        }

        const post = await response.json();
        console.log("Post data:", post);

        document.getElementById('title').value = post.title.rendered;
        document.getElementById('content').value = post.content.rendered.replace(/<[^>]*>/g, '');

    } catch (error) {
        console.error("Fetch error details:", error);
        // alert("Cannot load post: " + error.message);
        // window.location.href = '../index.html';
    }
});


const editPost = async (e) => {
    e.preventDefault();
    const base_url = getApiBase();

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        const response = await fetch(`${base_url}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXdvcGxhdGZybS1ibG9nLWFwcC5hdHdlYnBhZ2VzLmNvbSIsImlhdCI6MTc3MDYwMTMxNiwibmJmIjoxNzcwNjAxMzE2LCJleHAiOjE3NzEyMDYxMTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.cP4u5JvkBY_dmG2XgCjtU8klrW43OTQmi7JKqTMUVjE",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                content: content,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
        }

        alert('Post updated successfully');
        window.location.href = '../index.html';

    } catch (error) {
        console.error('Edit error:', error);
        alert('Failed to update: ' + error.message);
    }
};

document.getElementById('editPost').addEventListener("click", editPost)
