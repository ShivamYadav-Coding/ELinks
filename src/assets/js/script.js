//     const form = document.querySelector('form');
//     const email = document.querySelector('#email1');
//     const name = document.querySelector('#name1');
//     const username = document.querySelector('#username1');
//     const password = document.querySelector('#password1');
//     const confirmPassword = document.querySelector('#confirmPassword1');
//     const btn = document.querySelector('#btn');

//     btn.addEventListener('click', function(e) {
//         e.preventDefault();
//         validateMyForm();
//     });

//     // For displaying errors
//     function setErrMsg(input, errMsg) {
//        const formEle = input.parentElement; 
//        const err = formEle.querySelector('.err');
//        input.className = "input border-red-500 focus:shadow-lg";
//        err.className = "err";
//        err.innerText = errMsg;
//     }

//     // For mentioning xorrect input
//     function setSuccessMsg(input) {
//         const formEle = input.parentElement; 
//         const err = formEle.querySelector('.err');
//         input.className = "input border-green-500 focus:shadow-lg"
//         err.className = "err hidden";
//     }

//     // validateMyForm
//     async function validateMyForm() {
//         let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    
    
//     const emailVal = email.value.trim();
    
//        if(emailVal === ""){
//         setErrMsg(email, "Email field could not be empty.");
//     }
//     else if(emailVal.match(regexEmail)) {
//       setSuccessMsg(email);
//     }
//     else {
//         setErrMsg(email, "Email is not correct.");
//     }
    
//     console.log('Reached to name')
//     const nameVal = name.value.trim();
//     if (nameVal === ""){
//         setErrMsg(name, "Name field could not be empty.");
//     }
//     else {
//         setSuccessMsg(name);
//     }
    
//     console.log('Reached to username');
//     const usernameVal = username.value.trim();
//     if(usernameVal === ""){
//         setErrMsg(username, "Username field could not be empty.");
//     }
//     else {
//         setSuccessMsg(username);
//     }

//     const passwordVal = password.value.trim();    
//     if(passwordVal === "") {
//         setErrMsg(password, "Password field could not be empty.")
//     }
//     else if((passwordVal.length) < 7) {
//         setErrMsg(password, "Password length should be of atleast 7.")
//     }
//     else {
//         setSuccessMsg(password);
//     }

//     const cpasswordVal = confirmPassword.value.trim();
//     if(cpasswordVal === "") {
//         setErrMsg(confirmPassword, "Confirm password field could not be empty.")
//     }
//     else if(cpasswordVal != passwordVal) {
//         setErrMsg(confirmPassword, "Doesn't match with password.")
//     }
//     else {
//         setSuccessMsg(confirmPassword);
//     }
// }