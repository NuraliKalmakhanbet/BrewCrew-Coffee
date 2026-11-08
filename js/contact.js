// contact.js - contact form with validation; messages are saved in localStorage ("messages").

function setupContactForm() {
    var form = document.getElementById("contact-form");
    var nameInput = document.getElementById("contact-name");
    var emailInput = document.getElementById("contact-email");
    var phoneInput = document.getElementById("contact-phone");
    var messageInput = document.getElementById("contact-message");
    var counter = document.getElementById("char-count");
    var success = document.getElementById("contact-success");

    // fill name, email and phone for logged in users
    var user = getCurrentUser();
    if (user !== null) {
        nameInput.value = user.name;
        emailInput.value = user.email;
        phoneInput.value = user.phone;
    }

    watchField(nameInput, validateName);
    watchField(emailInput, validateEmail);
    watchField(phoneInput, validatePhone);
    watchField(messageInput, validateMessage);

    // live letter counter
    function updateCounter() {
        counter.textContent = messageInput.value.length + " / 300";
        if (messageInput.value.length > 300) {
            counter.classList.add("text-danger");
        } else {
            counter.classList.remove("text-danger");
        }
    }
    messageInput.addEventListener("input", updateCounter);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        success.hidden = true;

        var okName = checkField(nameInput, validateName);
        var okEmail = checkField(emailInput, validateEmail);
        var okPhone = checkField(phoneInput, validatePhone);
        var okMessage = checkField(messageInput, validateMessage);

        if (!(okName && okEmail && okPhone && okMessage)) {
            focusFirstError(form);
            return;
        }

        var messages = loadData("messages", []);
        var currentUser = getCurrentUser();
        var owner = "";
        if (currentUser !== null) {
            owner = currentUser.email;
        }
        messages.push({
            date: new Date().toISOString(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            message: messageInput.value.trim(),
            userEmail: owner
        });
        saveData("messages", messages);

        success.textContent = "Thank you, " + nameInput.value.trim() + "! Your message was saved. We will reply to " + emailInput.value.trim() + ".";
        success.hidden = false;
        messageInput.value = "";
        updateCounter();
        showToast("Message sent.");
    });

    document.getElementById("contact-reset").addEventListener("click", function () {
        form.reset();
        var fields = [nameInput, emailInput, phoneInput, messageInput];
        for (var i = 0; i < fields.length; i++) {
            showFieldError(fields[i], "");
        }
        success.hidden = true;
        updateCounter();
    });
}

document.addEventListener("DOMContentLoaded", setupContactForm);
