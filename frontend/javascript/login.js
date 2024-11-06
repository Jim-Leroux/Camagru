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
			console.log('Response:', data);
			window.location.href = '/#home';
		} else {
			console.log('Response:', data);
			container.innerHTML = '<div id="login">' +
				'<h1>Camagru</h1>' +
				'<form id="loginForm" action="login" method="POST">' +
				'<input id="email" type="email" name="email" placeholder="Email" required>' +
				'<input id="password" type="password" name="password" placeholder="Password" required>' +
				'<button type="submit">Log in</button>' +
				'</form>' +
				'<p>Don\'t have an account? <a href="#register">Sign up</a></p>' +
				'</div>';

			reloadCSS();

			document.getElementById('loginForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const formData = {
					email: document.getElementById('email').value,
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
					console.log('Response:', data);
					if (!data.error) {
						window.location.href = '/#home';
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
