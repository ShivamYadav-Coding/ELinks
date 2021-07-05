const toggleBtn = document.querySelector("#ham-btn");
const mobileMenu = document.querySelector("#mobile-menu");

const navbar = document.querySelector("nav");

toggleBtn.addEventListener('click', (e) => {
    mobileMenu.classList.toggle("hidden");
    navbar.classList.toggle("sticky");
    navbar.classList.toggle("fixed");
});