


function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}


const urlParams = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", async () => {
    const postId = urlParams.get('id');
    // console.log("postID", postId)

    const response = await fetch(`https://blog-app.infinityfree.me/?rest_route=/wp/v2/posts/${postId}`, {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJyb290IiwiaWF0IjoxNzY4OTIwMTE1LCJleHAiOjE5MjY2MDAxMTV9.OoUMjCceIX9r1lIZfqfK4bvpZoTZkv0aaXRji-37jGI",
        },
        mode: "cors",
    });
    // console.log("res", response)


    const post = await response.json();
    document.getElementById('title').value = post.title.rendered;
    document.getElementById('content').value = post.content.rendered.replace(/<[^>]*>/g, '')
});



const editPost = async (e) => {
    console.log("edit button working ... ")
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    console.log("id", postId)
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    await fetch(`http://127.0.0.1/myproject2/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJyb290IiwiaWF0IjoxNzY4OTIwMTE1LCJleHAiOjE5MjY2MDAxMTV9.OoUMjCceIX9r1lIZfqfK4bvpZoTZkv0aaXRji-37jGI",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            title,
            content,
        }),
    });

    alert('Post updated');
    window.location.href = '../index.html';
};

document.getElementById('editPost').addEventListener("click", editPost)
