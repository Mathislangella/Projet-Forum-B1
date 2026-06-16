let page = 1;
let loading = false;

const container = document.getElementById("posts-container");
const loadingDiv = document.getElementById("loading");

async function fetchPosts(page) {
    const res = await fetch(`/api/topic/posts?page=${page}`);
    return await res.json();
}

function createPost(post) {
    const div = document.createElement("article");
    div.className = "post-card";

    div.innerHTML = `
        <div class="post-left">
            <img src="/images/avatar.png" class="avatar">
        </div>

        <div class="post-right">
            <div class="post-header">
                <span class="username">${post.user}</span>
                <span class="post-date">${post.date}</span>
            </div>

            <div class="post-body">
                ${post.message}
            </div>

            <div class="post-actions">
                <button>👍 ${post.likes}</button>
                <button>💬 Citer</button>
                <button>🚩</button>
                <button>🔗</button>
            </div>
        </div>
    `;

    return div;
}

async function loadMore() {
    if (loading) return;
    loading = true;

    loadingDiv.style.display = "block";

    const posts = await fetchPosts(page);

    posts.forEach(p => {
        container.appendChild(createPost(p));
    });

    page++;
    loading = false;
    loadingDiv.style.display = "none";
}

window.addEventListener("scroll", () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (bottom) loadMore();
});

loadMore();