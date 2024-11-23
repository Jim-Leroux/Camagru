import { reloadCSS } from './utils.js';

export function home(container) {
	fetch('http://localhost:8000/checkSession', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (!data.logged) {
			console.log('Response:', data);
			window.location.href = '/#login';
		} else {
			console.log('Response:', data);
			container.innerHTML = 
			'<div id="home">' +
				'<nav id="navbar">' +
					'<ul id="nav-links">' +
						'<div id="logo-block">' +
						'<h1 id="nav-logo">Camagru</h1>' +
						'</div>' +
						'<div id="link-block">' +
						'<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>' +
						'<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>' + 
						'<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>' + 
						'<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>' + 
						'<li><a id="logoutButton" href=""><i class="fa-solid fa-right-to-bracket"></i></a></li>' +
						'</div>' +
					'</ul>' +
				'</nav>' +
				'<div id="posts-container">' +
					'<div id="posts" class="scrollable">OK</div>' +
				'</div>' +
				'<footer>' +
					'<nav id="footer-navbar">' +
						'<ul id="footer-nav-links">' +
							'<div id="footer-link-block">' +
							'<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>' +
							'<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>' + 
							'<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>' + 
							'<li><a href="#profil"><i class="fa-solid fa-user"></i></a></li>' + 
							'<li><a href="#logout"><i class="fa-solid fa-right-to-bracket"></i></a></li>' +
							'</div>' +
						'</ul>' +
					'</nav>' +
				'</footer>' +
			'</div>'

			fetch('http://localhost:8000/posts', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
			})	
			.then(response => response.json())
			.then(data => {
				console.log(data);
				const postsContainer = document.getElementById('posts');
				data.posts.forEach(post => {
					const postElement = document.createElement('div');
					postElement.className = 'post';
					postElement.innerHTML = `
						<div id="post">
							<img src="${post.post_path}" alt="${post.description}" />
							<p>${post.description}</p>
						</div>`;
					postsContainer.appendChild(postElement);
				});
			})
			.catch(error => console.error('Error loading posts:', error));
			

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
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
