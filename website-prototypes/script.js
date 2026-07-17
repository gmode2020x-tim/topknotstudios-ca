const tabs = Array.from(document.querySelectorAll(".tab"));
const concepts = Array.from(document.querySelectorAll(".concept"));
let activeIndex = 0;

function showConcept(index) {
  activeIndex = (index + concepts.length) % concepts.length;
  tabs.forEach((tab, tabIndex) => {
    tab.classList.toggle("active", tabIndex === activeIndex);
  });
  concepts.forEach((concept, conceptIndex) => {
    concept.classList.toggle("active", conceptIndex === activeIndex);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showConcept(index));
});

document.querySelector("[data-prev]").addEventListener("click", () => showConcept(activeIndex - 1));
document.querySelector("[data-next]").addEventListener("click", () => showConcept(activeIndex + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showConcept(activeIndex - 1);
  if (event.key === "ArrowRight") showConcept(activeIndex + 1);
});

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
