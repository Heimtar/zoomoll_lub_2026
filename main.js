"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPortfolioSlider(); /* ФИНАЛ: Передача индекса в CSS-переменную */
  initLightbox();        /* Полноэкранный просмотр фото */
});

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
 * Изящная горизонтальная лента «Наши работы» (Управление индексом)
 */
function initPortfolioSlider() {
  const track = document.getElementById("portfolio-track");
  const prevBtn = document.querySelector(".port-prev");
  const nextBtn = document.querySelector(".port-next");
  if (!track || track.children.length === 0) return;

  let currentIndex = 0;

  const getVisibleSlidesCount = () => {
    const width = window.innerWidth;
    if (width <= 650) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  const updateSliderPosition = () => {
    const maxIndex = track.children.length - getVisibleSlidesCount();

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    
    // Передаем чистый индекс в CSS. Браузер сам сделает идеальный сдвиг без багов округления
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
      if (faqItem) faqItem.classList.toggle("active");
    });
  });
}

/**
 * Интерактивный Lightbox-слайдер (Полноэкранный режим)
 */
function initLightbox() {
  const lightboxImages = document.querySelectorAll('.portfolio-track .portfolio-slide-item img');
  if (lightboxImages.length === 0) return;

  let currentLightboxIndex = 0;

  let lightboxOverlay = document.getElementById('lightbox-overlay');
  if (!lightboxOverlay) {
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
      <button class="lightbox-arrow lightbox-prev" aria-label="Предыдущее фото">❮</button>
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Большое фото питомца">
      </div>
      <button class="lightbox-arrow lightbox-next" aria-label="Следующее фото">❯</button>
    `;
    document.body.appendChild(lightboxOverlay);
  }

  const lightboxImg = lightboxOverlay.querySelector('img');
  const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
  const prevBtn = lightboxOverlay.querySelector('.lightbox-prev');
  const nextBtn = lightboxOverlay.querySelector('.lightbox-next');

  const updateLightboxImage = (idx) => {
    if (idx < 0 || idx >= lightboxImages.length) return;
    currentLightboxIndex = idx;
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
  };

  lightboxImages.forEach((img, idx) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxImage(idx);
      lightboxOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const showNext = (e) => {
    e.stopPropagation();
    let nextIdx = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage(nextIdx);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    let prevIdx = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage(prevIdx);
  };

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxOverlay.querySelector('.lightbox-content').addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext(e);
    if (e.key === 'ArrowLeft') showPrev(e);
    if (e.key === 'Escape') closeLightbox();
  });
}
