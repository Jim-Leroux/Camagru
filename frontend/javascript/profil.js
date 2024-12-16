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
				<div id="user-infos" class="user-infos">
					<div class="user-icon">
						<i style="color: #ff0059" class="fa-solid fa-user"></i>
					</div>
					<div class="stats">
						<p><strong>120</strong><br> Likes</p>
						<p><strong>10</strong><br> Posts</p>
						<p><strong>42</strong><br> Comments</p>
					</div>
					<p id="edit-profile-button"><strong>Edit profile</strong></p>
				</div>

				<div id="edit-profile-container" class="edit-profile-container">
					<p><strong>My infos</strong></p>
						<form id="edit-profile-form" action="submit" method="PUT">
							<input id="username" type="text" name="username" placeholder="Name" required>
							<input id="email" type="email" name="email" placeholder="Email" required>
							<input id="password" type="password" name="password" placeholder="Password" required>
							<button type="submit">Submit</button>
						</form>
					<i id="exit-edit" class="exit-edit fa-regular fa-circle-xmark"></i>
				</div>
			</div>
		</div>`;

	const app = document.getElementById('app');
	console.log("user :", app);
	app.style.alignItems = "center";

	const editProfileButton = document.getElementById('edit-profile-button');
	const editProfileContainer = document.getElementById('edit-profile-container');

	editProfileButton.addEventListener('click', function(event) {
		event.preventDefault();

		editProfileButton.style.color = "#ff0059";
		editProfileContainer.style.display = "flex";
	})

	document.getElementById("exit-edit").addEventListener('click', function(event) {
		event.preventDefault();

		editProfileButton.style.color = "unset";
		editProfileContainer.style.display = "none";
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
