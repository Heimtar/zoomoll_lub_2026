"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();      // Инициализация мобильного бургер-меню
  initScrollEffects();   // Эффекты скролла (шапка и кнопка Наверх)
  initPromoSlider();     // Главный промо-баннер
  initPortfolioSlider(); // Слайдер портфолио
  initReviewsSlider();   // Карусель отзывов
  initFaqAccordion();    // Аккордеон вопросов FAQ
  initLightbox();        // Полноэкранный просмотр фото
});

/**
 * Вспомогательная функция для безопасного управления блокировкой скролла.
 */
const updateScrollLock = () => {
  const isMenuOpen = document.querySelector('.nav-container.open');
  const isLightboxOpen = document.querySelector('#lightbox-overlay.active');
  
  if (isMenuOpen || isLightboxOpen) {
    document.body.classList.add('lock-scroll');
  } else {
    document.body.classList.remove('lock-scroll');
  }
};

/**
 * Мобильное бургер-меню
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuToggle || !navContainer) return;

  const toggleMenu = () => {
    const isOpen = navContainer.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    updateScrollLock();
  };

  menuToggle.addEventListener('click', toggleMenu);

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
  }, { passive: true });
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
  promoTimer = setInterval(handleNextSlide, 5000);
}

/**
 * Лента «Наши работы»
 */
function initPortfolioSlider() {
  const track = document.getElementById("portfolio-track");
  const prevBtn = document.querySelector(".port-prev");
  const nextBtn = document.querySelector(".port-next");
  if (!track || track.children.length === 0) return;

  let currentIndex = 0;

  const getVisibleSlidesCount = () => {
    if (window.matchMedia("(max-width: 500px)").matches) return 1;
    if (window.matchMedia("(max-width: 1024px)").matches) return 2;
    return 3;
  };

  const updateSliderPosition = () => {
    const visibleCount = getVisibleSlidesCount();
    const maxIndex = track.children.length - visibleCount;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    
    // Передаем переменные в CSS для плавного адаптивного расчета
    track.style.setProperty('--current-index', currentIndex);
    track.style.setProperty('--visible-slides', visibleCount);
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
    if (window.matchMedia("(max-width: 500px)").matches) return 1;
    if (window.matchMedia("(max-width: 1024px)").matches) return 2;
    return 3;
  };

  const updateReviewPosition = () => {
    const maxIndex = track.children.length - getVisibleCount();
    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;
    track.style.setProperty('--current-review-index', index);
  };

  const moveNext = () => {
    const maxIndex = track.children.length - getVisibleCount(); 
    index = index < maxIndex ? index + 1 : 0;
    updateReviewPosition();
  };

  const movePrev = () => {
    const maxIndex = track.children.length - getVisibleCount();
    index = index > 0 ? index - 1 : maxIndex;
    updateReviewPosition();
  };

  const startAutoPlay = () => { 
    if (!window.matchMedia("(max-width: 500px)").matches) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(moveNext, 4000); 
    }
  };
  const stopAutoPlay = () => { clearInterval(autoPlayTimer); };

  if (nextBtn) nextBtn.addEventListener("click", () => { moveNext(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { movePrev(); startAutoPlay(); });

  if (container) {
    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", startAutoPlay);
  }
  
  window.addEventListener("resize", () => {
    updateReviewPosition();
    startAutoPlay();
  });
  
  updateReviewPosition();
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
 * Интерактивный Lightbox-слайдер
 */
function initLightbox() {
  const slideItems = document.querySelectorAll('.portfolio-track .portfolio-slide-item');
  if (slideItems.length === 0) return;

  let currentLightboxIndex = 0;
  let lightboxOverlay = document.getElementById('lightbox-overlay');
  
  if (!lightboxOverlay) {
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';
    
    lightboxOverlay.innerHTML = `
      <button class="lightbox-arrow lightbox-prev" aria-label="Предыдущее фото">❮</button>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Закрыть">&times;</button>
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
    if (idx < 0 || idx >= slideItems.length) return;
    currentLightboxIndex = idx;
    
    const targetImg = slideItems[currentLightboxIndex].querySelector('img');
    if (targetImg) {
      lightboxImg.src = targetImg.src;
      lightboxImg.alt = targetImg.alt || "Фото питомца";
    }
  };

  slideItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      updateLightboxImage(index);
      lightboxOverlay.classList.add('active');
      updateScrollLock();
    });
  });

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    updateScrollLock();
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let nextIdx = (currentLightboxIndex + 1) % slideItems.length;
    updateLightboxImage(nextIdx);
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let prevIdx = (currentLightboxIndex - 1 + slideItems.length) % slideItems.length;
    updateLightboxImage(prevIdx);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });
}
