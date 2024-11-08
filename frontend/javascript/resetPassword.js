import { reloadCSS } from './utils.js';

export function resetPassword(container) {
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
			container.innerHTML = '<div id="resetPassword">' +
				'<h1>Camagru</h1>' +
				'<form id="resetPasswordForm" action="login" method="POST">' +
                '<h5>Trouble with loggin in ?</h5>' +
                '<p>Enter your email to reset your password</p>' +
				'<input id="password" type="password" name="password" placeholder="Password" required>' +
				'<button type="submit">Send</button>' +
				'<p id="error-message" style="color: red; display: none;"></p>' +
				'</form>' +
				'</div>';

			reloadCSS();

			document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
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
