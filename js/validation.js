
var form = document.getElementById("contact-form");

var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var confirmInput = document.getElementById("confirm-password");
var messageInput = document.getElementById("message");

var nameError = document.getElementById("name-error");
var emailError = document.getElementById("email-error");
var passwordError = document.getElementById("password-error");
var confirmError = document.getElementById("confirm-error");
var messageError = document.getElementById("message-error");
var formSuccess = document.getElementById("form-success");

function showError(input, errorElement, text) {
    errorElement.textContent = text;
    input.classList.add("input-error");
}

function clearError(input, errorElement) {
    errorElement.textContent = "";
    input.classList.remove("input-error");
}

function isEmailValid(email) {
    var atIndex = email.indexOf("@");
    var dotIndex = email.lastIndexOf(".");

    if (atIndex < 1) {
        return false;
    }
    if (dotIndex < atIndex + 2) {
        return false;
    }
    if (dotIndex >= email.length - 1) {
        return false;
    }
    if (email.indexOf(" ") !== -1) {
        return false;
    }
    return true;
}

form.onsubmit = function (event) {
    event.preventDefault();

    var isValid = true;
    formSuccess.textContent = "";

    var nameValue = nameInput.value.trim();
    if (nameValue === "") {
        showError(nameInput, nameError, "Please enter your name.");
        isValid = false;
    } else if (nameValue.length < 2) {
        showError(nameInput, nameError, "Name must be at least 2 characters.");
        isValid = false;
    } else {
        clearError(nameInput, nameError);
    }

    var emailValue = emailInput.value.trim();
    if (emailValue === "") {
        showError(emailInput, emailError, "Please enter your email.");
        isValid = false;
    } else if (!isEmailValid(emailValue)) {
        showError(emailInput, emailError, "Email format is wrong. Example: name@example.com");
        isValid = false;
    } else {
        clearError(emailInput, emailError);
    }

    var passwordValue = passwordInput.value;
    if (passwordValue === "") {
        showError(passwordInput, passwordError, "Please enter a password.");
        isValid = false;
    } else if (passwordValue.length < 6) {
        showError(passwordInput, passwordError, "Password must be at least 6 characters.");
        isValid = false;
    } else {
        clearError(passwordInput, passwordError);
    }

    var confirmValue = confirmInput.value;
    if (confirmValue === "") {
        showError(confirmInput, confirmError, "Please confirm your password.");
        isValid = false;
    } else if (confirmValue !== passwordValue) {
        showError(confirmInput, confirmError, "Passwords do not match.");
        isValid = false;
    } else {
        clearError(confirmInput, confirmError);
    }

    var messageValue = messageInput.value.trim();
    if (messageValue === "") {
        showError(messageInput, messageError, "Please write a message.");
        isValid = false;
    } else if (messageValue.length < 10) {
        showError(messageInput, messageError, "Message must be at least 10 characters.");
        isValid = false;
    } else {
        clearError(messageInput, messageError);
    }

    if (isValid) {
        formSuccess.textContent = "Thank you! Your message was sent successfully.";
        form.reset();
    }
};
