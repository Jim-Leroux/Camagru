export function reloadCSS() {
	const preloadLink = document.createElement('link');
	preloadLink.rel = 'preload';
	preloadLink.href = '../css/styles.css';
	preloadLink.as = 'style';
	preloadLink.onload = () => {
		preloadLink.rel = 'stylesheet';
	};
	document.head.appendChild(preloadLink);
}
