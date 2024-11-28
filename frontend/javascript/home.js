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
			container.innerHTML = '<h1>Hello from home!</h1>' +
			'<button id="logoutButton" type="click">Log out</button>'

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
