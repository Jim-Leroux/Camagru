import { register } from './register.js';
import { login } from './login.js';
import { home } from './home.js';

export function router() {
	const app = document.getElementById('app');
	const route = window.location.hash;
	console.log(route)

	if (route === '#register') {
		register(app);
	} else if (route === '#login') {
		login(app);
	} else if (route === '#home') {
		home(app);
	} else {
		app.innerHTML = '<h1>Welcome camagru</h1>';
	}
}
