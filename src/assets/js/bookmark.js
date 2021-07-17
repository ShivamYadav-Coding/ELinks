var bookmarkName;
var Url;
const submitBtn = document.getElementById('submitBtn');
const err1 = document.getElementById('err1');
const err2 = document.getElementById('err2');
const form = document.getElementById('bookmarkForm');

function mySubmitFunction(e) {
    e.preventDefault();
    var checkName = validateName();
    var checkUrl = validateUrl();

    if(checkName && checkUrl) {
        form.submit();
    }
    else 
       return false;
}

function validateName() {
    bookmarkName = document.getElementById('bookmarkName').value;
    bookmarkName = bookmarkName.trim();
    if(bookmarkName == ''){
        if(err1.classList.contains('hidden'))
        err1.classList.remove('hidden');

        return false;
    }

    if(!err1.classList.contains('hidden'))
       err1.classList.add('hidden');
    return true;
}

function validateUrl() {
    Url = document.getElementById('bookmarkUrl').value;
    Url = Url.trim();
    if(Url == ''){
        if(err2.classList.contains('hidden'))
        err2.classList.remove('hidden');

        return false;
    }

    if(!err2.classList.contains('hidden'))
       err2.classList.add('hidden');

    return true;
}