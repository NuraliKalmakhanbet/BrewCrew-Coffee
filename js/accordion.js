
var headers = document.getElementsByClassName("accordion-header");

for (var i = 0; i < headers.length; i++) {
    headers[i].onclick = function () {
        var content = this.nextElementSibling;
        var icon = this.querySelector(".accordion-icon");

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.textContent = "+";
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = "-";
        }
    };
}
