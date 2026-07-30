// ==========================================
// 1. ГЛАВНЫЙ ИНИЦИАЛИЗАТОР ВСЕХ СКРИПТОВ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPawAnimation();
});

// ==========================================
// 2. ЛОГИКА ДЛЯ МОДАЛЬНОГО ОКНА (ЗАПИСЬ)
// ==========================================
function initModal() {
  const ctaButton = document.getElementById("cta-btn");
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("modal-close");
  const okButton = document.getElementById("modal-ok-btn");

  if (!modal) return;

  const toggleModal = (displayState) => {
    modal.style.display = displayState;
  };

  if (ctaButton) ctaButton.addEventListener("click", () => toggleModal("flex"));
  if (closeButton) closeButton.addEventListener("click", () => toggleModal("none"));
  if (okButton) okButton.addEventListener("click", () => toggleModal("none"));
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) toggleModal("none");
  });
}

// ==========================================
// 3. СКРОЛЛ-ЭФФЕКТЫ (ШАПКА И КНОПКА НАВЕРХ)
// ==========================================
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

// ==========================================
// 4. ВЕРХНИЙ ПРОМО-СЛАЙДЕР (МОПС И КОТ)
// ==========================================
function initPromoSlider() {
  const promoTrack = document.getElementById("promo-track");
  const prevPromoBtn = document.querySelector(".prev-promo");
  const nextPromoBtn = document.querySelector(".next-promo");

  if (!promoTrack) return;

  let promoIndex = 0;
  let promoTimer = null;

  const getPromoWidth = () => {
    const slide = promoTrack.querySelector("img");
    return slide ? slide.getBoundingClientRect().width : 0;
  };

  const updatePromoSlider = () => {
    promoTrack.style.transform = `translateX(-${promoIndex * getPromoWidth()}px)`;
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
  promoTimer = setInterval(handleNextSlide, 5000);
}

// ==========================================
// 5. НИЖНИЙ СЛАЙДЕР ОТЗЫВОВ С ПАУЗОЙ
// ==========================================
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
    const maxIndex = track.children.length - 1; 
    index = index < maxIndex ? index + 1 : 0;
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  };

  const movePrev = () => {
    index = index > 0 ? index - 1 : track.children.length - 1;
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

// ==========================================
// 6. АККОРДЕОН ДЛЯ БЛОКА ВОПРОСОВ (FAQ)
// ==========================================
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      if (faqItem) faqItem.classList.toggle("active");
    });
  });
}

// ==========================================
// 7. ДЕКОРАТИВНАЯ АНИМАЦИЯ СЛЕДОВ ЛАПОК
// ==========================================
function initPawAnimation() {
  const heroBlock = document.querySelector(".hero");
  if (!heroBlock) return;

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

  const triggerPawsAnimation = () => {
    pawSteps.forEach((data) => {
      const pawElement = document.createElement("div");
      pawElement.className = "hero-paws-track";
      pawElement.style.setProperty("--paw-rotate", data.rotate);
      pawElement.style.top = data.top;
      pawElement.style.left = data.left;
      pawElement.style.background = "url('img/cat_paws.png') no-repeat center/contain"; 
      pawElement.style.animation = `pawStep 2.5s ease-out ${data.delay} forwards`;
      
      heroBlock.appendChild(pawElement);
      setTimeout(() => pawElement.remove(), 5000);
    });
  };

  triggerPawsAnimation();
  setInterval(triggerPawsAnimation, 15000);
}
