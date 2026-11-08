// validation.js - form checks used by the sign up, log in and contact forms.
// Every check function returns an error text, or "" when the value is correct.

function validateName(value) {
    value = value.trim();
    if (value === "") {
        return "Please enter your name.";
    }
    if (value.length < 2) {
        return "Name must have at least 2 characters.";
    }
    if (value.length > 60) {
        return "Name must be shorter than 60 characters.";
    }
    // letters (any language), spaces, apostrophe, dot and hyphen
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
        return "Name can contain only letters, spaces, hyphens and apostrophes.";
    }
    return "";
}

function validateEmail(value) {
    value = value.trim();
    if (value === "") {
        return "Please enter your email.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Email format is wrong. Example: name@example.com";
    }
    return "";
}

function validatePhone(value) {
    value = value.trim();
    if (value === "") {
        return "Please enter your phone number.";
    }
    if (!/^\+?[0-9\s\-()]+$/.test(value)) {
        return "Phone can contain only digits, spaces, +, - and brackets.";
    }
    var digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
        return "Phone must have from 10 to 15 digits. Example: +7 777 123 45 67";
    }
    return "";
}

// used when a NEW password is created
function validatePassword(value) {
    if (value === "") {
        return "Please enter a password.";
    }
    if (value.length < 8) {
        return "Password must have at least 8 characters.";
    }
    if (value.length > 64) {
        return "Password must be shorter than 64 characters.";
    }
    if (!/[a-z]/.test(value)) {
        return "Password needs at least one lowercase letter.";
    }
    if (!/[A-Z]/.test(value)) {
        return "Password needs at least one uppercase letter.";
    }
    if (!/[0-9]/.test(value)) {
        return "Password needs at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
        return "Password needs at least one special character, for example ! @ # $.";
    }
    return "";
}

// used on the log in form (we only check that it is not empty)
function validateRequiredPassword(value) {
    if (value === "") {
        return "Please enter your password.";
    }
    return "";
}

function validateMessage(value) {
    value = value.trim();
    if (value === "") {
        return "Please write a message.";
    }
    if (value.length < 10) {
        return "Message must have at least 10 characters.";
    }
    if (value.length > 300) {
        return "Message is too long (maximum 300 characters).";
    }
    return "";
}

// ---------- helpers that show the error under the field ----------
function showFieldError(input, message) {
    var error = document.getElementById(input.id + "-error");
    if (message === "") {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        error.textContent = "";
    } else {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        error.textContent = message;
    }
}

// runs the check function for one field, returns true if the field is correct
function checkField(input, checkFunction) {
    var message = checkFunction(input.value);
    showFieldError(input, message);
    return message === "";
}

// When the user presses a button or a checkbox, the field they leave must NOT show a
// new error yet: the error text would push the page down and the click would miss
// the button. The whole form is checked when it is submitted anyway.
var pressingNonTextElement = false;

document.addEventListener("mousedown", function (event) {
    var tag = event.target.tagName;
    var type = event.target.type;
    var isTextField = tag === "TEXTAREA" || (tag === "INPUT" && type !== "checkbox" && type !== "submit" && type !== "button");
    pressingNonTextElement = !isTextField;
});

// the mouse button is released: from now on the fields are checked on blur again
document.addEventListener("mouseup", function () {
    setTimeout(function () {
        pressingNonTextElement = false;
    }, 0);
});

// check the field when the user leaves it, and again while typing if it has an error
function watchField(input, checkFunction) {
    input.addEventListener("blur", function () {
        if (pressingNonTextElement) {
            return;
        }
        checkField(input, checkFunction);
    });
    input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) {
            checkField(input, checkFunction);
        }
    });
}

// "Show password" checkbox
function setupShowPassword(passwordInputs) {
    var checkbox = document.getElementById("show-password");
    checkbox.addEventListener("change", function () {
        for (var i = 0; i < passwordInputs.length; i++) {
            if (checkbox.checked) {
                passwordInputs[i].type = "text";
            } else {
                passwordInputs[i].type = "password";
            }
        }
    });
}

// puts the cursor in the first field with an error
function focusFirstError(form) {
    var bad = form.querySelector(".is-invalid");
    if (bad) {
        bad.focus();
    }
}
