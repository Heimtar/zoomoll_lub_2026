"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();      // Инициализация мобильного бургер-меню
  initScrollEffects();   // Эффекты скролла (шапка и кнопка Наверх)
  initPromoSlider();     // Главный промо-баннер
  initReviewsSlider();   // Карусель отзывов
  initFaqAccordion();    // Аккордеон вопросов FAQ
  initPortfolioSlider(); // Слайдер портфолио
  initLightbox();        // Фикс: возвращаем вызов полноэкранного Lightbox
});


/**
 * Мобильное бургер-меню
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuToggle || !navContainer) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    navContainer.classList.toggle('open');
    document.body.classList.toggle('lock-scroll'); // Чтобы контент страницы не прокручивался под меню
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Автоматическое закрытие шторки меню при клике на якорные ссылки
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Эффекты скролла страницы (Шапка сайта и кнопка "Наверх")
 */
function initScrollEffects() {
  const toTopButton = document.getElementById("to-top-btn");
  const siteHeader = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (toTopButton) toTopButton.classList.toggle("show", currentScroll > 300);
    if (siteHeader) siteHeader.classList.toggle("shrunk", currentScroll > 50);
  });
}
/**
 * Слайдер рекламных промо-баннеров
 */
function initPromoSlider() {
  const promoTrack = document.getElementById("promo-track");
  const prevPromoBtn = document.querySelector(".prev-promo");
  const nextPromoBtn = document.querySelector(".next-promo");
  if (!promoTrack) return;

  let promoIndex = 0;
  let promoTimer = null;

  const updatePromoSlider = () => {
    const slide = promoTrack.querySelector(".promo-slide");
    if (!slide) return;
    const slideWidth = slide.getBoundingClientRect().width;
    promoTrack.style.transform = `translateX(-${promoIndex * slideWidth}px)`;
  };

  const handleNextSlide = () => {
    promoIndex = (promoIndex + 1) % promoTrack.children.length;
    updatePromoSlider();
  };

  const handlePrevSlide = () => {
    const total = promoTrack.children.length;
    promoIndex = (promoIndex - 1 + total) % total;
    updatePromoSlider();
  };

  const restartAutoPlay = () => {
    clearInterval(promoTimer);
    promoTimer = setInterval(handleNextSlide, 5000);
  };

  if (nextPromoBtn) nextPromoBtn.addEventListener("click", () => { handleNextSlide(); restartAutoPlay(); });
  if (prevPromoBtn) prevPromoBtn.addEventListener("click", () => { handlePrevSlide(); restartAutoPlay(); });

  window.addEventListener("resize", updatePromoSlider);
  window.addEventListener("load", updatePromoSlider);
  promoTimer = setInterval(handleNextSlide, 5000);
}

/**
 * Изящная горизонтальная лента «Наши работы»
 */
function initPortfolioSlider() {
  const track = document.getElementById("portfolio-track");
  const prevBtn = document.querySelector(".port-prev");
  const nextBtn = document.querySelector(".port-next");
  if (!track || track.children.length === 0) return;

  let currentIndex = 0;

  const getVisibleSlidesCount = () => {
    const width = window.innerWidth;
    if (width <= 500) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  const updateSliderPosition = () => {
    const maxIndex = track.children.length - getVisibleSlidesCount();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    track.style.setProperty('--current-index', currentIndex);
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const maxIndex = track.children.length - getVisibleSlidesCount();
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0; 
      updateSliderPosition();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const maxIndex = track.children.length - getVisibleSlidesCount();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex; 
      updateSliderPosition();
    });
  }

  window.addEventListener("resize", updateSliderPosition);
  updateSliderPosition();
}
/**
 * Карусель отзывов клиентов
 */
function initReviewsSlider() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const container = document.querySelector(".carousel-container");
  if (!track || track.children.length === 0) return;

  let index = 0;
  let autoPlayTimer = null; 

  const getVisibleCount = () => {
    const width = window.innerWidth;
    if (width <= 500) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  const getSlideWidth = () => {
    const card = track.querySelector(".review-card"); 
    return card ? card.getBoundingClientRect().width + 20 : 0; 
  };

  const moveNext = () => {
    const maxIndex = track.children.length - getVisibleCount(); 
    index = index < maxIndex ? index + 1 : 0;
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  };

  const movePrev = () => {
    const maxIndex = track.children.length - getVisibleCount();
    index = index > 0 ? index - 1 : maxIndex;
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  };

  const startAutoPlay = () => { 
    if (window.innerWidth > 500) autoPlayTimer = setInterval(moveNext, 4000); 
  };
  const stopAutoPlay = () => { clearInterval(autoPlayTimer); };

  if (nextBtn) nextBtn.addEventListener("click", () => { moveNext(); stopAutoPlay(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { movePrev(); stopAutoPlay(); startAutoPlay(); });

  if (container) {
    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", startAutoPlay);
  }
  
  window.addEventListener("resize", () => {
    index = 0;
    track.style.transform = `translateX(0px)`;
  });
  
  startAutoPlay();
}

/**
 * Аккордеон часто задаваемых вопросов (FAQ)
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.closest(".faq-item");
      if (faqItem) faqItem.classList.toggle("active");
    });
  });
}
