
var openBtn = document.getElementById("open-popup");
var closeBtn = document.getElementById("close-popup");
var overlay = document.getElementById("popup-overlay");

var subForm = document.getElementById("subscribe-form");
var subName = document.getElementById("sub-name");
var subEmail = document.getElementById("sub-email");
var subNameError = document.getElementById("sub-name-error");
var subEmailError = document.getElementById("sub-email-error");
var subSuccess = document.getElementById("sub-success");

openBtn.onclick = function () {
    overlay.classList.add("show");
};

closeBtn.onclick = function () {
    overlay.classList.remove("show");
};

overlay.onclick = function (event) {
    if (event.target === overlay) {
        overlay.classList.remove("show");
    }
};

subForm.onsubmit = function (event) {
    event.preventDefault();

    var isValid = true;
    subSuccess.textContent = "";

    if (subName.value.trim() === "") {
        subNameError.textContent = "Please enter your name.";
        subName.classList.add("input-error");
        isValid = false;
    } else {
        subNameError.textContent = "";
        subName.classList.remove("input-error");
    }

    var email = subEmail.value.trim();
    if (email === "" || email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2 || email.lastIndexOf(".") >= email.length - 1) {
        subEmailError.textContent = "Please enter a correct email.";
        subEmail.classList.add("input-error");
        isValid = false;
    } else {
        subEmailError.textContent = "";
        subEmail.classList.remove("input-error");
    }

    if (isValid) {
        subSuccess.textContent = "You are subscribed. Thank you!";
        subForm.reset();
    }
};
