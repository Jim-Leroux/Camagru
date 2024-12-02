import { reloadCSS, checkSession, getAllPosts, sendLike } from './utils.js'

export async function home(container, callback, scrollValue) {
	const userSession = await checkSession();

	if (userSession.logged == false)
		window.location.href = '/#login';

	const usersPosts = await getAllPosts();

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
		</div>`;

	const postsContainer = document.getElementById('posts');

	for (const post of usersPosts.posts) {
		let totalLikes = 0;

		post.likes.forEach(like => {
			if (post.id === like.post_id)
				totalLikes++;
		});
		let textLike = totalLikes === 1 ? "like" : "likes";

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
						<i id="post-like-icon" class="heart-icon fa-solid fa-heart"></i>
						<i id="comment-icon" class="fa-regular fa-comment" comment-post-id="${post.id}"></i>
					</div>
				</div>
				<div id="post-bottom">
					<p id="description"><strong>Name</strong>: ${post.description}</p>
				</div>
			</div>`;

		for (const like of post.likes) {
			if (like.user_id == document.cookie.split('=')[1]) {
				postElement.innerHTML = postElement.innerHTML.replace("<i id=\"post-like-icon\" class=\"heart-icon fa-solid fa-heart\"></i>",
					"<i id=\"post-like-icon\" class=\"heart-icon fa-solid fa-heart\" style=\"color: red\"></i>");
				break;
			}
		}

		const sendLikeIcon = postElement.querySelector("#post-like-icon");

		sendLikeIcon.addEventListener('click', () => {
			const postsPos = document.getElementById('posts-container');
			scrollValue = postsPos.scrollTop;

			sendLike(post.id);
			home(container, () => {
				const postsPos = document.getElementById('posts-container');
				postsPos.scrollTop = scrollValue;
			}, scrollValue);
		});

		postsContainer.appendChild(postElement);
	}

	if (callback && typeof callback === 'function') {
		callback(scrollValue);
	}
}
