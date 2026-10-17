
var slides = document.getElementsByClassName("slide");
var prevBtn = document.getElementById("prev-slide");
var nextBtn = document.getElementById("next-slide");
var current = 0;

function showSlide(number) {
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active-slide");
    }
    slides[number].classList.add("active-slide");
}

function nextSlide() {
    current = current + 1;
    if (current >= slides.length) {
        current = 0;
    }
    showSlide(current);
}

function prevSlide() {
    current = current - 1;
    if (current < 0) {
        current = slides.length - 1;
    }
    showSlide(current);
}

nextBtn.onclick = nextSlide;
prevBtn.onclick = prevSlide;

setInterval(nextSlide, 4000);
