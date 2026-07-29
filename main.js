// ==========================================
// 1. ЛОГИКА ДЛЯ ВСПЛЫВАЮЩЕГО ОКНА (МОДАЛКА)
// ==========================================
const ctaButton = document.getElementById("cta-btn");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("modal-close");
const okButton = document.getElementById("modal-ok-btn");

if (ctaButton && modal) {
  ctaButton.addEventListener("click", () => { modal.style.display = "flex"; });
}
if (closeButton && modal) {
  closeButton.addEventListener("click", () => { modal.style.display = "none"; });
}
if (okButton && modal) {
  okButton.addEventListener("click", () => { modal.style.display = "none"; });
}
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) { modal.style.display = "none"; }
  });
}

// ==========================================
// 2. ЛОГИКА ДЛЯ КНОПКИ «НАВЕРХ»
// ==========================================
const toTopButton = document.getElementById("to-top-btn");
window.addEventListener("scroll", () => {
  if (toTopButton) {
    if (window.scrollY > 300) { toTopButton.classList.add("show"); } 
    else { toTopButton.classList.remove("show"); }
  }
});

// ==========================================
// 3. ВЕРХНИЙ БАННЕР (МОПС + КОТ) С АВТОПРОКРУТКОЙ
// ==========================================
const promoTrack = document.getElementById("promo-track");
const prevPromoBtn = document.querySelector(".prev-promo");
const nextPromoBtn = document.querySelector(".next-promo");

let promoIndex = 0;
let promoTimer = null;

function getPromoWidth() {
  const slide = document.querySelector("#promo-track img");
  if (!slide) return 0;
  return slide.getBoundingClientRect().width;
}

function updatePromoSlider() {
  if (!promoTrack) return;
  promoTrack.style.transform = `translateX(-${promoIndex * getPromoWidth()}px)`;
}

function nextPromoSlide() {
  if (!promoTrack) return;
  const totalSlides = promoTrack.children.length;
  promoIndex = (promoIndex + 1) % totalSlides;
  updatePromoSlider();
}

function prevPromoSlide() {
  if (!promoTrack) return;
  const totalSlides = promoTrack.children.length;
  promoIndex = (promoIndex - 1 + totalSlides) % totalSlides;
  updatePromoSlider();
}

function startPromoAutoPlay() {
  promoTimer = setInterval(nextPromoSlide, 5000);
}

function resetPromoTimer() {
  clearInterval(promoTimer);
  startPromoAutoPlay();
}

if (nextPromoBtn && prevPromoBtn) {
  nextPromoBtn.addEventListener("click", () => { nextPromoSlide(); resetPromoTimer(); });
  prevPromoBtn.addEventListener("click", () => { prevPromoSlide(); resetPromoTimer(); });
}

window.addEventListener("resize", updatePromoSlider);
startPromoAutoPlay();

// ==========================================
// 4. ВОЗВРАЩАЕМ НИЖНЮЮ КАРУСЕЛЬ «НАШИ РАБОТЫ»
// ==========================================
const track = document.getElementById("carousel-track");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const carouselContainer = document.querySelector(".carousel-container"); 

let index = 0;
let autoPlayTimer = null; 

function getSlideWidth() {
  const card = document.querySelector(".portfolio-item"); // Находим твою карточку работы
  if (!card) return 0;
  return card.getBoundingClientRect().width + 25; // 25 — это расстояние между ними
}

function moveNext() {
  if (!track) return;
  const maxIndex = track.children.length - 3; // Код останавливается, когда видны последние 3 собаки
  if (index < maxIndex) { index++; } 
  else { index = 0; }
  track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
}

function movePrev() {
  if (!track) return;
  if (index > 0) { index--; } 
  else { index = track.children.length - 3; }
  track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => { moveNext(); stopAutoPlay(); startAutoPlay(); });
  prevBtn.addEventListener("click", () => { movePrev(); stopAutoPlay(); startAutoPlay(); });
}

function startAutoPlay() { autoPlayTimer = setInterval(moveNext, 4000); }
function stopAutoPlay() { clearInterval(autoPlayTimer); }

if (carouselContainer) {
  carouselContainer.addEventListener("mouseenter", stopAutoPlay);
  carouselContainer.addEventListener("mouseleave", startAutoPlay);
}
startAutoPlay();

// ==========================================
// 5. ЛОГИКА ДЛЯ БЛОКА ВОПРОСОВ-ОТВЕТОВ (FAQ)
// ==========================================
const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    if (faqItem) { faqItem.classList.toggle("active"); }
  });
});

// ==========================================
// 6. АНИМАЦИЯ СЛЕДОВ ЛАПОК ПО ДИАГОНАЛИ
// ==========================================
const heroBlock = document.querySelector(".hero");
const pawSteps = [
  { top: "80%", left: "10%", delay: "0.0s", rotate: "45deg" },
  { top: "72%", left: "16%", delay: "0.3s", rotate: "40deg" },
  { top: "63%", left: "20%", delay: "0.6s", rotate: "30deg" },
  { top: "55%", left: "26%", delay: "0.9s", rotate: "50deg" },
  { top: "48%", left: "33%", delay: "1.2s", rotate: "55deg" },
  { top: "40%", left: "42%", delay: "1.5s", rotate: "45deg" },
  { top: "33%", left: "49%", delay: "1.8s", rotate: "60deg" },
  { top: "25%", left: "58%", delay: "2.1s", rotate: "65deg" }
];

function triggerPawsAnimation() {
  if (!heroBlock) return;
  pawSteps.forEach((data) => {
    const pawElement = document.createElement("div");
    pawElement.className = "hero-paws-track";
    pawElement.style.setProperty("--paw-rotate", data.rotate);
    pawElement.style.top = data.top;
    pawElement.style.left = data.left;
    pawElement.style.animation = `pawStep 2.5s ease-out ${data.delay} forwards`;
    heroBlock.appendChild(pawElement);
    setTimeout(() => { pawElement.remove(); }, 5000);
  });
}
triggerPawsAnimation();
setInterval(triggerPawsAnimation, 15000);
