const postData = async () => {

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("Please fill in both title and content");
        return;
    }

    const post_data = {
        title: title,
        content: content,
        status: "draft",
        excerpt: content.substring(0, 100) + "...",
        author: 1
    }

    try {

        const button = document.getElementById("createPost");
        button.disabled = true;
        button.textContent = "Creating...";

        const response = await fetch("https://blog-app.infinityfree.me/?rest_route=/wp/v2/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJyb290IiwiaWF0IjoxNzY4OTIwMTE1LCJleHAiOjE5MjY2MDAxMTV9.OoUMjCceIX9r1lIZfqfK4bvpZoTZkv0aaXRji-37jGI"
            },
            body: JSON.stringify(post_data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
        }

        const response_data = await response.json();
        console.log("Post created successfully", response_data);


        document.getElementById("title").value = "";
        document.getElementById("content").value = "";


        alert(`Post created successfully! ID: ${response_data.id}`);

    } catch (error) {
        console.error("Error while creating post:", error);
        alert(`Failed to create post: ${error.message}`);
    } finally {

        const button = document.getElementById("createPost");
        button.disabled = false;
        button.textContent = "Create Post";
    }
}


const createPostBtn = document.getElementById("createPost");
if (createPostBtn) {
    createPostBtn.addEventListener("click", postData);
}