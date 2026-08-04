"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
});

/**
 * Эффекты скролла страницы (Шапка сайта и кнопка "Наверх")
 */
function initScrollEffects() {
  const toTopButton = document.getElementById("to-top-btn");
  const siteHeader = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (toTopButton) {
      toTopButton.classList.toggle("show", currentScroll > 300);
    }
    
    if (siteHeader) {
      siteHeader.classList.toggle("shrunk", currentScroll > 50);
    }
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

  if (nextPromoBtn) {
    nextPromoBtn.addEventListener("click", () => { handleNextSlide(); restartAutoPlay(); });
  }
  if (prevPromoBtn) {
    prevPromoBtn.addEventListener("click", () => { handlePrevSlide(); restartAutoPlay(); });
  }

  window.addEventListener("resize", updatePromoSlider);
  window.addEventListener("load", updatePromoSlider);
  promoTimer = setInterval(handleNextSlide, 5000);
}

/**
 * Карусель отзывов клиентов
 */
function initReviewsSlider() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const container = document.querySelector(".carousel-container");

  if (!track) return;

  let index = 0;
  let autoPlayTimer = null; 

  const getSlideWidth = () => {
    const card = track.querySelector(".review-card"); 
    return card ? card.getBoundingClientRect().width + 20 : 0;
  };

  const moveNext = () => {
    const maxIndex = track.children.length - 3; 
    index = index < maxIndex ? index + 1 : 0;
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  };

  const movePrev = () => {
    const maxIndex = track.children.length - 3;
    index = index > 0 ? index - 1 : maxIndex;
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  };

  const startAutoPlay = () => { autoPlayTimer = setInterval(moveNext, 4000); };
  const stopAutoPlay = () => { clearInterval(autoPlayTimer); };

  if (nextBtn) nextBtn.addEventListener("click", () => { moveNext(); stopAutoPlay(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { movePrev(); stopAutoPlay(); startAutoPlay(); });

  if (container) {
    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", startAutoPlay);
  }

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
      if (faqItem) {
        faqItem.classList.toggle("active");
      }
    });
  });
}
