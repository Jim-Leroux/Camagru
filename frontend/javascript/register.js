import { reloadCSS } from './utils.js';

export function register(container) {
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
            container.innerHTML = '<div id="register">' +
            '<h1>Camagru</h1>' +
            '<form id="registerForm" action="register" method="POST">' +
            '<input id="username" type="text" name="username" placeholder="Nom" required>' +
            '<input id="email" type="email" name="email" placeholder="Email" required>' +
            '<input id="password" type="password" name="password" placeholder="Mot de passe" required>' +
            '<button type="submit">Sign up</button>' +
            '</form>' +
            '<p>Have an account? <a href="#login">Log in</a></p>' +
            '</div>';

            reloadCSS();

            document.getElementById('registerForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };

                fetch('http://localhost:8000/register', {
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
                        window.location.href = '/#login';
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
