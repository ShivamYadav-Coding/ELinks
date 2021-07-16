const toggleBtn = document.querySelector("#ham-btn");
const mobileMenu = document.querySelector("#mobile-menu");
const dropModalX = document.querySelector("#drop-modal-close");
const dropModalBox = document.querySelector('#drop-Modal-Box');
const addNewNotesBtn = document.querySelector('#add-New-Notes-Btn');

const navbar = document.querySelector("nav");

toggleBtn.addEventListener('click', (e) => {
    mobileMenu.classList.toggle("hidden");
    navbar.classList.toggle("sticky");
    navbar.classList.toggle("fixed");
});

dropModalX.addEventListener('click', () => {
    dropModalBox.classList.add("hidden");
})

addNewNotesBtn.addEventListener('click', () =>{
    dropModalBox.classList.remove("hidden");
})