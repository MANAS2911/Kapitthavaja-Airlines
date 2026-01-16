const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // If user scrolls down 50px, make navbar solid black
        navbar.classList.add('scrolled');
    } else {
        // If at the top, make it transparent again
        navbar.classList.remove('scrolled');
    }
});