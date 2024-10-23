const carousel = document.querySelector(".accordion .carousel");
const arrowBtns = document.querySelectorAll(".accordion .card-wrapper .material-symbols-rounded");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;

let isDragging = false;
let startX;
let scrollLeft;


// Fungsionalitas panah buat pencet scroll
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "left-btn") {
            carousel.scrollLeft -= firstCardWidth + 35;  // Move left by the width of one card
        } else {
            carousel.scrollLeft += firstCardWidth + 35;  // Move right by the width of one card
        }
    });
});


const dragStart = (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add("dragging");
};

const dragging = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 to increase the scroll speed
    carousel.scrollLeft = scrollLeft - walk;
};

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
};

// Buat desktop
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);

// Buat mobile
carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("touchend", dragStop);
