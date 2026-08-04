"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPortfolioLoader(); /* Кнопка Показать/Свернуть без инлайн-стилей */
  initLightbox();        /* Современный Lightbox-слайдер со стрелками */
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
 * Умная кнопка: Раскрытие галереи и сворачивание её обратно (БЕЗ ИНЛАЙН-СТИЛЕЙ)
 */
function initPortfolioLoader() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  const portfolioSection = document.getElementById('portfolio');
  const masonryGrid = document.querySelector('.portfolio-masonry');
  if (!loadMoreBtn || !masonryGrid) return;

  loadMoreBtn.setAttribute('data-state', 'collapsed');

  loadMoreBtn.addEventListener('click', () => {
    const state = loadMoreBtn.getAttribute('data-state');

    if (state === 'collapsed') {
      masonryGrid.classList.add('is-expanded');
      loadMoreBtn.textContent = 'Свернуть работы обратно';
      loadMoreBtn.setAttribute('data-state', 'expanded');
    } else {
      masonryGrid.classList.remove('is-expanded');
      loadMoreBtn.textContent = 'Показать ещё работы';
      loadMoreBtn.setAttribute('data-state', 'collapsed');

      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

/**
 * Интерактивный Lightbox-слайдер с перелистыванием стрелками
 */
function initLightbox() {
  const images = document.querySelectorAll('.portfolio-masonry .masonry-item img');
  if (images.length === 0) return;

  let currentIndex = 0;

  const lightbox = document.createElement('div');
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
