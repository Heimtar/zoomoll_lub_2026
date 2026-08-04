"use strict";

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPortfolioLoader(); /* Обновленная кнопка Показать/Свернуть */
  initLightbox();        /* НОВАЯ ФУНКЦИЯ: Увеличение картинок при клике */
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
 * Умная кнопка: Раскрытие галереи и сворачивание её обратно
 */
function initPortfolioLoader() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  const portfolioSection = document.getElementById('portfolio');
  if (!loadMoreBtn) return;

  // Изначально вешаем состояние, что галерея свернута
  loadMoreBtn.setAttribute('data-state', 'collapsed');

  loadMoreBtn.addEventListener('click', () => {
    const hiddenItems = document.querySelectorAll('.portfolio-masonry .masonry-item');
    const state = loadMoreBtn.getAttribute('data-state');

    if (state === 'collapsed') {
      // РАСКРЫВАЕМ: Показываем карточки с 7 по 13
      hiddenItems.forEach((item, index) => {
        if (index >= 6) {
          item.style.display = 'block';
          item.classList.add('fade-in-active');
        }
      });
      // Меняем текст и состояние кнопки
      loadMoreBtn.textContent = 'Свернуть работы обратно';
      loadMoreBtn.setAttribute('data-state', 'expanded');
    } else {
      // СВОРАЧИВАЕМ: Прячем карточки обратно
      hiddenItems.forEach((item, index) => {
        if (index >= 6) {
          item.style.display = 'none';
          item.classList.remove('fade-in-active');
        }
      });
      // Возвращаем текст и состояние кнопки
      loadMoreBtn.textContent = 'Показать ещё работы';
      loadMoreBtn.setAttribute('data-state', 'collapsed');

      // Мягко скроллим пользователя к началу блока портфолио, чтобы он не потерялся
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

/**
 * Интерактивный Lightbox для просмотра картинок в большом окне
 */
function initLightbox() {
  // Динамически создаем окно просмотра в памяти, чтобы не захламлять HTML
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox-overlay';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img src="" alt="Большое фото питомца">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const items = document.querySelectorAll('.portfolio-masonry .masonry-item img');

  // Клик на любую картинку в галерее открывает окно
  items.forEach(img => {
    img.style.cursor = 'zoom-in'; // Меняем курсор на лупу при наведении
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Защита от конфликтов
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Запрещаем скролл сайта под окном
    });
  });

  // Закрытие окна при клике на крестик, фон или кнопку назад
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл сайта
    lightboxImg.src = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => e.stopPropagation());
}
