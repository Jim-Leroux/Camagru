import { reloadCSS, checkSession, getUserInfos, getAllPosts, getAllLikes, getAllComments } from './utils.js'

export async function home(container) {

    const userSession = await checkSession()

    if (userSession.logged == false)
        window.location.href = '/#login';

    const usersPosts = await getAllPosts()

    const usersLikes = await getAllLikes()

    const usersComments = await getAllComments()

    console.log(usersPosts)
    console.log(usersLikes)
    console.log(usersComments)

    container.innerHTML = 
			`<div id="home">
				<nav id="navbar">
					<ul id="nav-links">
						<div id="logo-block">
						<h1 id="nav-logo">Camagru</h1>
						</div>
						<div id="link-block">
						<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
						<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li> 
						<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li> 
						<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li> 
						<li><a id="logoutButton" href=""><i class="fa-solid fa-right-to-bracket"></i></a></li>
						</div>
					</ul>
				</nav>
				<div id="posts-container">
					<div id="posts" class="scrollable"></div>
				</div>
				<footer>
					<nav id="footer-navbar">
						<ul id="footer-nav-links">
							<div id="footer-link-block">
							<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
							<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li> 
							<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li> 
							<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li> 
							<li><a href="#logout"><i class="fa-solid fa-right-to-bracket"></i></a></li>
							</div>
						</ul>
					</nav>
				</footer>
			</div>`

    document.getElementById('logoutButton').addEventListener('click', function(event) {
        event.preventDefault();
        fetch('http://localhost:8000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (!data.error) {
                window.location.href = '/#login';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    })

    const postsContainer = document.getElementById('posts');

    for (const post of usersPosts.posts) { 
        let totalLikes = 0;

        usersLikes.likes.forEach(like => {
            if (post.id === like.post_id)
                totalLikes++;
        });
        let textLike = totalLikes === 1 ? "like" : "likes";

        const userInfo = await getUserInfos(post.user_id);

        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div id="post">
                <img src="${post.post_path}" alt="${post.description}"/>
                <div id="post-description-section">
                    <div>
                        <p>${totalLikes} ${textLike}</p>
                    </div>
                    <div id="post-like-comment">
                        <i id="heart-icon" class="heart-icon fa-solid fa-heart" heart-post-id="${post.id}"></i>
                        <i id="comment-icon" class="fa-regular fa-comment" comment-post-id="${post.id}"></i>
                    </div>
                </div>
                <div id="post-bottom">
                    <p id="description"><strong>${userInfo.username}</strong>: ${post.description}</p>
                </div>
            </div>`;

        postsContainer.appendChild(postElement);
        const heartIcon = postElement.querySelector('.heart-icon');

        if (heartIcon) {
            heartIcon.addEventListener('click', function() {
                const postId = heartIcon.getAttribute('data-post-id'); // Récupérer l'ID de la publication
                console.log(`Publication cliquée avec ID: ${postId}`);
                heartIcon.classList.toggle('clicked');
            });
        } else {
            console.log('Heart icon not found');
        }

        const commentIcon = postElement.querySelector('.comment-icon');

        if (heartIcon) {
            heartIcon.addEventListener('click', function() {
                console.log("2")
                // heartIcon.classList.toggle('clicked');
            });
        } else {
            console.log('Heart icon not found');
        }
    }
}