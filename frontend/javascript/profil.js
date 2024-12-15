import { checkSession, getUser } from "./utils.js"

export async function profil(container) {
	const userSession = await checkSession();

	if (userSession.logged == false) {
		window.location.href = '/#login';
		return ;
	}

	const user = await getUser();

	console.log(user);

	container.innerHTML =
		`<div id="home">
			<div id="logo-block">
				<h1 id="nav-logo">Camagru</h1>
			</div>
			<nav id="navbar">
				<ul id="nav-links" class="nav-links">
					<li><a href="#home"><i class="fa-solid fa-house"></i></a></li>
					<li><a href="#gallery"><i class="fa-solid fa-magnifying-glass"></i></a></li>
					<li><a href="#post"><i class="fa-regular fa-square-plus"></i></a></li>
					<li><a href="#profil"><i style="color: #ff0059" class="fa-solid fa-user"></i></a></li>
					<li><a href="#login"><i id="logoutButton" class="fa-solid fa-right-to-bracket"></i></a></li>
				</ul>
			</nav>
			<div id="user-container">
				<div class="user-infos">
					<div class="user-icon">
						<i style="color: #ff0059" class="fa-solid fa-user"></i>
					</div>
					<div class="stats">
						<p><strong>120</strong> Likes</p>
						<p><strong>10</strong> Posts</p>
						<p><strong>42</strong> Comments</p>
					</div>
					<button id="edit-profile-button">Edit profile</button>
				</div>

				<div class="edit-profile-container">
					<form id="edit-profile-form" action="submit" method="PUT">
						<input id="username" type="text" name="username" placeholder="Name" required>
						<input id="email" type="email" name="email" placeholder="Email" required>
						<input id="password" type="password" name="password" placeholder="Password" required>
					</form>
					<button type="submit">Submit</button>
				</div>
			</div>
		</div>`;

	const app = document.getElementById('app');
	console.log("user :", app);
	app.style.alignItems = "center";

	const userContainer = document.getElementsByClassName('user-infos');
	const editProfileButton = document.getElementById('edit-profile-button');
	const editProfileContainer = document.getElementsByClassName('edit-profile-container');

	editProfileButton.addEventListener('click', function(event) {
		event.preventDefault();

		console.log(userContainer);
		console.log(editProfileContainer);

		userContainer.style.display = "none";
		editProfileContainer.style.display = "flex";
	})

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
}
