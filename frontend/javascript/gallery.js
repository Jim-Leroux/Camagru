import { reloadCSS, checkSession, getAllPosts, sendLike, getAllLikes} from './utils.js'

export async function gallery(container) {

	const userSession = await checkSession()

	const usersPosts = await getAllPosts()

	const usersLikes = await getAllLikes()

	const posts = usersPosts.posts;

	const postsPerPage = 9;
	let currentPage = 1;

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
								<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
							</div>
					</ul>
				</nav>
				<div id="gallery-container">
					<div id="gallery-posts">
					</div>
					<div id="pagination-controls">
						<p id="prev-page" disabled>Back</p>
						<p id="next-page">Next</p>
					</div>
				</div>
				<footer>
					<nav id="footer-navbar">
						<ul id="footer-nav-links">
							<div id="footer-link-block">
							<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
							<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
							<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
							<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>
							<li><a href=""><i class="fa-solid fa-right-to-bracket"></i></a></li>
							</div>
						</ul>
					</nav>
				</footer>
			</div>`

	if (userSession.logged == false) {
		const navElement = document.getElementById('link-block');
		navElement.innerHTML = `
		<li><a href="#login"><i class="fa-solid fa-house"></i></a></li>
		<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
		<li><a href="#login"><i class="fa-regular fa-square-plus"></i></a></li>
		<li><a href="#login"><i class="fa-solid fa-user"></i></a></li>
		<li><a href="#login"><i class="fa-solid fa-right-to-bracket"></i></a></li>
		`
		const footerNavElement = document.getElementById('footer-link-block');
		footerNavElement.innerHTML = `
		<li><a href="#login"><i class="fa-solid fa-house"></i></a></li>
		<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
		<li><a href="#login"><i class="fa-regular fa-square-plus"></i></a></li>
		<li><a href="#login"><i class="fa-solid fa-user"></i></a></li>
		<li><a href="#login"><i class="fa-solid fa-right-to-bracket"></i></a></li>
		`
	}

	const homeContainer = document.getElementById('home');
	const galleryContainer = document.getElementById('gallery-container');
	const postsContainer = document.getElementById('gallery-posts');
	const prevButton = document.getElementById('prev-page');
	const nextButton = document.getElementById('next-page');

	function renderPage(page) {
		postsContainer.innerHTML = '';
		const start = (page - 1) * postsPerPage;
		const end = page * postsPerPage;
		const postsToShow = posts.slice(start, end);

		postsToShow.forEach((post) => {
			const postElement = document.createElement('div');
			postElement.className = 'post';
			postElement.innerHTML = `
			<div id="gallery-post">
				<img id ="imgsrc" src="${post.post_path}" alt="${post.description}" />
			</div>`;
			postsContainer.appendChild(postElement);
		});

		prevButton.disabled = page === 1;
		nextButton.disabled = end >= posts.length;

		const userPosts = document.querySelectorAll('.post');
		let index = 0;
		for (let i = 0; userPosts[i]; i++) {
			userPosts[i].addEventListener('click', () => {
				if (userSession.logged == false)
					window.location.href = '/#login';
				else {
					const focusedElement = document.createElement('div')
					focusedElement.setAttribute("id", "focused-section");
					index = postsToShow[i].id;
					focusedElement.innerHTML = `
					<i id="exit-focus-icon" class="fa-solid fa-xmark"></i>
					<div id="focused-post">
					<div id="focused-post-img">
					<img src="${postsToShow[i].post_path}" alt="${postsToShow[i].description}" />
					</div>
					<div id="focused-post-section">
					<div id="comment-display-section">

					</div>
					<div id="react-section">
					<p><strong>${postsToShow[i].likes.length}</strong> likes</p>
					<div id="like-comment-section">
					<i id="post-like-icon" class="fa-solid fa-heart"></i>
					<form id="post-comment-form" action="post-comment" method="POST">
					<label for="comment-form"></label>
					<input type="text" id="comment-input-form" name"comment-input-form" placeholder="Add a comment...">
					<p id="send-comment" type="submit" value="Submit"><strong>Post</strong></p>
					</form>
					</div>
					</div>
					</div>
					</div>
					`;
					galleryContainer.appendChild(focusedElement);
					homeContainer.setAttribute("style", "overflow: hidden;")

					const exitButton = document.getElementById("exit-focus-icon");
					const focusedSection = document.getElementById("focused-section");
					const sendLikeIcon = document.getElementById("post-like-icon");

					console.log(postsToShow[i])

					console.log(postsToShow[i].likes)


					for (let like = 0; postsToShow[i].likes[like]; like++) {
						if (postsToShow[i].likes[like].user_id == document.cookie.split('=')[1]) {
							sendLikeIcon.style.color = "red";
						}
					}

					exitButton.addEventListener('click', () => {
						focusedSection.remove();
						homeContainer.setAttribute("style", "overflow: visible;")
					})

					sendLikeIcon.addEventListener('click', () => {
						sendLike(index);
						gallery(container);
						renderPage(currentPage);
					})
				}
			})
		}
	}

	renderPage(currentPage);

	prevButton.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			renderPage(currentPage);
		}
	});

	nextButton.addEventListener('click', () => {
		if (currentPage * postsPerPage < posts.length) {
			currentPage++;
			renderPage(currentPage);
		}
	});

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
}
