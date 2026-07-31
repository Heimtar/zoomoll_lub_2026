document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPawAnimation();
  initPriceCalculator(); // Запуск нашего калькулятора цен
});

// --- Modal System (Ваше старое окно "Заявка принята") ---
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

// --- Scroll Effects (Header & To Top Button) ---
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

// --- Promo Slider (Баннеры) ---
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

// --- Reviews Slider (Отзывы) ---
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

// --- FAQ Accordion ---
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

// --- Decorative Paw Animation ---
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

// --- УМНЫЙ КАЛЬКУЛЯТОР ЦЕН БЕЗ ОШИБОК И СТЫКОВ ---
function initPriceCalculator() {
  const priceData = {
    dog: {
      breeds: ['Шпиц', 'Йоркширский терьер', 'Корги', 'Лабрадор'],
      services: {
        'Шпиц': { 'Комплексный уход': 2000, 'Гигиеническая стрижка': 1200, 'Экспресс-линька': 1800 },
        'Йоркширский терьер': { 'Комплексный уход': 2000, 'Гигиеническая стрижка': 1200, 'Экспресс-линька': 1800 },
        'Корги': { 'Комплексный уход': 2500, 'Гигиеническая стрижка': 1500, 'Экспресс-линька': 2200 },
        'Лабрадор': { 'Комплексный уход': 3500, 'Гигиеническая стрижка': 1800, 'Экспресс-линька': 3000 }
      }
    },
    cat: {
      breeds: ['Короткошерстная кошка', 'Мейн-кун / Пушистая кошка'],
      services: {
        'Короткошерстная кошка': { 'Комплексный уход': 1800, 'Гигиеническая стрижка': 1500, 'Экспресс-линька': 1800 },
        'Мейн-кун / Пушистая кошка': { 'Комплексный уход': 2500, 'Гигиеническая стрижка': 1800, 'Экспресс-линька': 2400 }
      }
    }
  };

  // Ищем модалку по общему классу .modal-overlay, чтобы точно сработало!
  const calcModal = document.querySelector('.modal-overlay');
  const petSelect = document.getElementById('calc-pet-type');
  const breedSelect = document.getElementById('calc-breed');
  const serviceSelect = document.getElementById('calc-service');
  const resultBox = document.getElementById('calc-result-box');
  const finalPrice = document.getElementById('calc-final-price');
  const closeBtn = document.querySelector('.close-calc-btn');

  if (!calcModal || !petSelect || !breedSelect || !serviceSelect) return;

  // Открытие по кнопкам "Подробнее"
  document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', () => {
      calcModal.style.display = 'flex';
    });
  });

  // Закрытие
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      calcModal.style.display = 'none';
      resetCalculator();
    });
  }

  calcModal.addEventListener('click', (e) => {
    if (e.target === calcModal) {
      calcModal.style.display = 'none';
      resetCalculator();
    }
  });

  // Выбор питомца
  petSelect.addEventListener('change', function() {
    resetSelect(breedSelect, '-- Выберите породу --');
    resetSelect(serviceSelect, '-- Сначала выберите породу --');
    resultBox.style.display = 'none';
    
    if (this.value) {
      priceData[this.value].breeds.forEach(breed => {
        let opt = new Option(breed, breed);
        breedSelect.add(opt);
      });
      breedSelect.disabled = false;
    } else {
      breedSelect.disabled = true;
    }
    serviceSelect.disabled = true;
  });

  // Выбор породы
  breedSelect.addEventListener('change', function() {
    resetSelect(serviceSelect, '-- Выберите процедуру --');
    resultBox.style.display = 'none';
    
    if (this.value) {
      const petType = petSelect.value;
      const availableServices = Object.keys(priceData[petType].services[this.value]);
      
      availableServices.forEach(service => {
        let opt = new Option(service, service);
        serviceSelect.add(opt);
      });
      serviceSelect.disabled = false;
    } else {
      serviceSelect.disabled = true;
    }
  });

  // Выбор услуги и финал цены
  serviceSelect.addEventListener('change', function() {
    if (this.value) {
      const petType = petSelect.value;
      const breed = breedSelect.value;
      const price = priceData[petType].services[breed][this.value];
      
      finalPrice.innerText = price + ' ₽';
      resultBox.style.display = 'block';
    } else {
      resultBox.style.display = 'none';
    }
  });

  function resetSelect(selectElement, defaultText) {
    selectElement.innerHTML = `<option value="">${defaultText}</option>`;
  }

  function resetCalculator() {
    petSelect.value = '';
    resetSelect(breedSelect, '-- Сначала выберите питомца --');
resetSelect(serviceSelect, '-- Сначала выберите породу --');breedSelect.disabled = true;serviceSelect.disabled = true;resultBox.style.display = 'none';}}