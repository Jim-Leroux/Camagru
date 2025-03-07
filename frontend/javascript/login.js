import { reloadCSS } from './utils.js';

export function login(container) {
	fetch('http://localhost:8000/checkSession', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then(response => response.json())
	.then(data => {
		if (data.logged) {
			window.location.href = '/#home';
		} else {
			container.innerHTML = `
			<div class="main-form-container">
				<div id="login" class="form-container">
					<h1 id="logo">Camagru</h1>
					<h2 id="slogan"><span class="slogan">Connect</span> and <span class="slogan">share</span> with <span class="slogan">people</span> from all over the <span class="slogan">world</span></h1>
					<form id="loginForm" action="login" method="POST">
						<input id="username" type="text" name="username" placeholder="Username" autocomplete="off" required>
						<input id="password" type="password" name="password" placeholder="Password" autocomplete="off" required>
						<button type="submit">Log in</button>
					</form>
					<div class="options">
						<p id="error-message" style="color: red; display: none;"></p>
						<a href="#resetPassword"><p>Forgot password ?</a>
						<p>Don\'t have an account? <a href="#register">Sign up</a></p>
					</div>
				</div>
			</div> `


			reloadCSS();

			const app = document.getElementById('app');
			app.style.alignItems = "center";

			document.getElementById('loginForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const formData = {
					username: document.getElementById('username').value,
					password: document.getElementById('password').value
				};

				fetch('http://localhost:8000/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify(formData)
				})
				.then(response => response.json())
				.then(data => {
					if (!data.error) {
						window.location.href = '/#home';
					} else {
						const errorMessageElement = document.getElementById("error-message");
						errorMessageElement.textContent = data.error;
						errorMessageElement.style.display = 'block';
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			});
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}
