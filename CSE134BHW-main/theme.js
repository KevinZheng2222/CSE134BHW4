// Saving and Reading the Theme
const themeKey = "theme";

function readTheme() {
	try {
		return localStorage.getItem(themeKey);
	} catch (error) {
		return null;
	}
}

function saveTheme(theme) {
	try {
		localStorage.setItem(themeKey, theme);
	} catch (error) {
		console.warn("The theme preference could not be saved.");
	}
}

function applyTheme(theme) {
	document.documentElement.dataset.theme = theme;
}

const savedTheme = readTheme();
if (savedTheme) {
	applyTheme(savedTheme);
}

// Button
document.addEventListener("DOMContentLoaded", function () {
	const button = document.querySelector("#theme-toggle");

	function currentTheme() {
		if (document.documentElement.dataset.theme === "light") {
			return "light";
		}
		return "dark";
	}

	function updateButton() {
		if (currentTheme() === "light") {
			button.textContent = "Switch to dark theme";
		} else {
			button.textContent = "Switch to light theme";
		}
	}

	button.addEventListener("click", function () {
		let next = "light";
		if (currentTheme() === "light") {
			next = "dark";
		}

		function changeTheme() {
			applyTheme(next);
			saveTheme(next);
			updateButton();
		}

		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (document.startViewTransition && !reduceMotion) {
			document.startViewTransition(changeTheme);
		} else {
			changeTheme();
		}
	});
	updateButton();
	button.hidden = false;
});