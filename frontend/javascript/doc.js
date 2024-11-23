import { reloadCSS, checkSession, getAllPosts } from './utils.js';

export async function gallery(container) {
    const userSession = await checkSession();

    const usersPosts = await getAllPosts();
    const posts = usersPosts.posts; // Toutes les publications
    const postsPerPage = 9; // Nombre de publications par page
    let currentPage = 1; // Page actuelle

    container.innerHTML = `
        <div id="home">
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
                <div id="gallery-posts"></div>
                <div id="pagination-controls">
                    <button id="prev-page" disabled>Previous</button>
                    <span id="current-page">Page ${currentPage}</span>
                    <button id="next-page">Next</button>
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
        </div>`;

    const postsContainer = document.getElementById('gallery-posts');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const currentPageDisplay = document.getElementById('current-page');

    // Fonction pour afficher une page spécifique
    function renderPage(page) {
        postsContainer.innerHTML = ''; // Réinitialiser le contenu
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

        // Activer/Désactiver les boutons
        prevButton.disabled = page === 1;
        nextButton.disabled = end >= posts.length;

        // Mettre à jour l'affichage de la page actuelle
        currentPageDisplay.textContent = `Page ${page}`;
    }

    // Écouteurs pour les boutons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage * postsPerPage < posts.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Rendu initial
    renderPage(currentPage);
}
