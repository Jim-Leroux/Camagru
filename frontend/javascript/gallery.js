import { reloadCSS, checkSession, getAllPosts} from './utils.js'

export async function gallery(container) {

	const userSession = await checkSession()

	const usersPosts = await getAllPosts()

	console.log(usersPosts);

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
						<li><a id="logoutButton" href=""><i class="fa-solid fa-right-to-bracket"></i></a></li>
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
							<li><a href="#logout"><i class="fa-solid fa-right-to-bracket"></i></a></li>
							</div>
						</ul>
					</nav>
				</footer>
			</div>`

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
				<img src="${post.post_path}" alt="${post.description}" />
			</div>`;
			postsContainer.appendChild(postElement);
		});

		prevButton.disabled = page === 1;
		nextButton.disabled = end >= posts.length;

	}

	// const post = document.getElementById('gallery-post');


	// post.addEventListener('click', () => {
	// 	if (userSession.logged == false)
	// 		window.location.href = '/#login';
	// })

	prevButton.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			renderPage(currentPage)
		}
	});

	nextButton.addEventListener('click', () => {
		if (currentPage * postsPerPage < posts.length) {
			currentPage++;
			renderPage(currentPage)
		}
	});

	renderPage(currentPage);
}
