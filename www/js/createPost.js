
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
        status: "publish",
        excerpt: content.substring(0, 100) + "...",
        author: 1
    }

    try {
        const PROXY = "https://corsproxy.io/?";
        const WORDPRESS_BASE = "http:///api/proxy/wp/v2";

        const button = document.getElementById("createPost");
        button.disabled = true;
        button.textContent = "Creating...";

        const response = await fetch(`${PROXY}${encodeURIComponent(WORDPRESS_BASE + '/posts')}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXdvcGxhdGZybS1ibG9nLWFwcC5hdHdlYnBhZ2VzLmNvbSIsImlhdCI6MTc3MDYwMTMxNiwibmJmIjoxNzcwNjAxMzE2LCJleHAiOjE3NzEyMDYxMTYsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.cP4u5JvkBY_dmG2XgCjtU8klrW43OTQmi7JKqTMUVjE"
            },
            body: JSON.stringify(post_data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
        }

        const response_data = await response.json();
        console.log("Post created successfully", response_data);
        window.location.href = '../index.html';


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