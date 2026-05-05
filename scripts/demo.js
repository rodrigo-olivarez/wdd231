const navButton = document.querySelector('#ham-btn');

navButton.addEventListener('click', () => {
    navButton.classList.toggle('show');
});

const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
    navButton.classList.toggle('show');
    navBar.classList.toggle('show');
});