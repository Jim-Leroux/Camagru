import { reloadCSS, checkSession, getAllPosts, sendLike, sendComment, getAllUsers} from './utils.js'

export async function home(container, callback, scrollValue) {
	const userSession = await checkSession();

	if (userSession.logged == false)
		window.location.href = '/#login';

	const usersPosts = await getAllPosts();

	const usersList = await getAllUsers();

	container.innerHTML =
		`<div id="home">
			<nav id="navbar">
				<ul id="nav-links" class="nav-links">
					<div id="logo-block">
					<h1 id="nav-logo">Camagru</h1>
					</div>
					<div id="link-block">
					<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
					<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
					<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
					<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>
					<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
					</div>
				</ul>
			</nav>
			<div id="posts-container">
				<div id="posts" class="scrollable"></div>
			</div>
			<footer>
				<nav id="footer-navbar">
					<ul id="footer-nav-links" class="nav-links">
						<div id="footer-link-block">
						<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
						<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
						<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
						<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>
						<li><a href="#login"><i id="footerLogoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
						</div>
					</ul>
				</nav>
			</footer>
		</div>`;

	const app = document.getElementById('app');
	console.log("home :", app);
	app.style.alignItems = "center";

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
						<i id="post-comment-icon" class="comment fa-regular fa-comment" comment-post-id="${post.id}"></i>
					</div>
				</div>
				<div id="post-bottom">
					<p id="description"><strong>${usersList[post.user_id - 1].username}</strong>: ${post.description}</p>
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
		const sendCommentIcon = postElement.querySelector("#post-comment-icon");

		sendLikeIcon.addEventListener('click', () => {
			const postsPos = document.getElementById('posts-container');
			scrollValue = postsPos.scrollTop;

			sendLike(post.id);
			home(container, () => {
				const postsPos = document.getElementById('posts-container');
				postsPos.scrollTop = scrollValue;
			}, scrollValue);
		});

		sendCommentIcon.addEventListener('click', () => {
			const focusedElement = document.createElement('div')
					focusedElement.setAttribute("id", "focused-section");
					focusedElement.innerHTML = `
					<i id="exit-focus-icon" class="fa-solid fa-xmark"></i>
					<div id="focused-post">
						<div id="focused-post-img">
							<img src="${post.post_path}" alt="${post.description}" />
						</div>
						<div id="focused-post-section">
							<div id="comment-display-section">

							</div>
							<div id="react-section">
								<p><strong>${post.likes.length}</strong> likes</p>
								<div id="like-comment-section">
									<i id="focused-like-icon" class="fa-solid fa-heart"></i>
									<form id="post-comment-form" action="post-comment" method="POST">
										<label for="comment-input-form"></label>
										<input type="text" id="comment-input-form" name="comment-input-form" placeholder="Add a comment..." required>
										<p id="send-comment"><strong>Post</strong></p>
									</form>
								</div>
							</div>
						</div>
					</div>
					`;
					postsContainer.appendChild(focusedElement);

					const sendLikeIcon = document.getElementById("focused-like-icon");
					const exitButton = document.getElementById("exit-focus-icon");
					const focusedSection = document.getElementById("focused-section");
					const commentDisplay = document.getElementById("comment-display-section");
					const sendCommentButton = document.getElementById("send-comment");

					for (let like = 0; post.likes[like]; like++) {
						if (post.likes[like].user_id == document.cookie.split('=')[1]) {
							sendLikeIcon.style.color = "red";
							break;
						}
					}

					for (let c = 0; post.comments[c]; c++) {
						const userComment = document.createElement('p');
						userComment.setAttribute("id", "userComment")
						userComment.innerHTML = `
						<strong>${usersList[post.comments[c].user_id -1].username}:</strong> ${post.comments[c].comment}
						`;
						commentDisplay.appendChild(userComment);
					}

					exitButton.addEventListener('click', () => {
						focusedSection.remove();
					})

					sendLikeIcon.addEventListener('click', () => {
						const postsPos = document.getElementById('posts-container');
						scrollValue = postsPos.scrollTop;
						sendLike(post.id);
						home(container, () => {
							const postsPos = document.getElementById('posts-container');
							postsPos.scrollTop = scrollValue;
							const userPosts = document.querySelectorAll('.comment');
							userPosts[post.id - 1].click();
						}, scrollValue);
					})

					const form = document.getElementById('post-comment-form');
					const commentInput = document.getElementById('comment-input-form');

					sendCommentButton.addEventListener('click', () => {
						if (form.checkValidity()) {
							const postsPos = document.getElementById('posts-container');
							scrollValue = postsPos.scrollTop;
							const commentValue = commentInput.value;
							const post_id = post.id;
							sendComment(post_id, commentValue);

							home(container, () => {
								const postsPos = document.getElementById('posts-container');
								postsPos.scrollTop = scrollValue;
								const userPosts = document.querySelectorAll('.comment');
								userPosts[post.id - 1].click();
							}, scrollValue);
						} else {
							form.reportValidity();
						}
					});

		})
		postsContainer.appendChild(postElement);
	}

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
				app.style.alignItems = "center";
				window.location.href = '/#login';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		})
	})

	document.getElementById('footerLogoutButton').addEventListener('click', function(event) {
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


	if (callback && typeof callback === 'function') {
		callback(scrollValue);
	}
}
