"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPortfolioSlider(); /* НОВАЯ ФУНКЦИЯ: Интеллектуальное листание ленты работ */
  initLightbox();        /* ОБНОВЛЕННАЯ ФУНКЦИЯ: Полноэкранный слайдер */
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
 * Изящная горизонтальная лента «Наши работы»
 */
function initPortfolioSlider() {
  const track = document.getElementById("portfolio-track");
  const prevBtn = document.querySelector(".port-prev");
  const nextBtn = document.querySelector(".port-next");
  if (!track) return;

  let currentIndex = 0;

  // Рассчитываем, сколько карточек помещается в окне просмотра
  const getVisibleSlidesCount = () => {
    const width = window.innerWidth;
    if (width <= 650) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  // Получаем точную ширину одной карточки с учетом зазора (gap)
  const getSlideWidth = () => {
    const slide = track.querySelector(".portfolio-slide-item");
    if (!slide) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  };

  const updateSliderPosition = () => {
    const maxIndex = track.children.length - getVisibleSlidesCount();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    
    track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const maxIndex = track.children.length - getVisibleSlidesCount();
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0; // Зацикливание вперед
      updateSliderPosition();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const maxIndex = track.children.length - getVisibleSlidesCount();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex; // Зацикливание назад
      updateSliderPosition();
    });
  }

  window.addEventListener("resize", updateSliderPosition);
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
 * Интерактивный Lightbox-слайдер с перелистыванием стрелками
 */
function initLightbox() {
  // Находим картинки внутри нашей обновленной структуры
  const images = document.querySelectorAll('.portfolio-track .portfolio-slide-item img');
  if (images.length === 0) return;

  let currentIndex = 0;

  let lightbox = document.getElementById('lightbox-overlay');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-overlay';
    lightbox.innerHTML = `
      <button class="lightbox-arrow lightbox-prev" aria-label="Предыдущее фото">❮</button>
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="" alt="Большое фото питомца">
      </div>
      <button class="lightbox-arrow lightbox-next" aria-label="Следующее фото">❯</button>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const updateLightboxImage = (index) => {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
  };

  images.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const showNext = (e) => {
    e.stopPropagation();
    let nextIndex = (currentIndex + 1) % images.length;
    updateLightboxImage(nextIndex);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    let prevIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage(prevIndex);
  };

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext(e);
    if (e.key === 'ArrowLeft') showPrev(e);
    if (e.key === 'Escape') closeLightbox();
  });
}
