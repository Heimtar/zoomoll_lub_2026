document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initScrollEffects();
  initPromoSlider();
  initReviewsSlider();
  initFaqAccordion();
  initPawAnimation();
  initPriceCalculator(); /* <-- ДОБАВИЛИ: Теперь калькулятор запустится вместе с сайтом! */
});


// --- Modal System ---
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
// --- Promo Slider ---
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

// --- Reviews Slider ---
function initReviewsSlider() {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const container = document.querySelector(".carousel-container"); 

  // ==========================================================================
// --- СИСТЕМА УМНОГО КАЛЬКУЛЯТОРА ЦЕН (Интеграция с DIKIDI) ---
// ==========================================================================
function initPriceCalculator() {
  // 1. НАША БАЗА ДАННЫХ: Породы и цены (ты можешь менять эти цифры в любой момент)
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

  // Находим все элементы калькулятора на странице
  const calcModal = document.getElementById('price-calculator-modal');
  const petSelect = document.getElementById('calc-pet-type');
  const breedSelect = document.getElementById('calc-breed');
  const serviceSelect = document.getElementById('calc-service');
  const resultBox = document.getElementById('calc-result-box');
  const finalPrice = document.getElementById('calc-final-price');
  const closeBtn = document.querySelector('.close-calc-btn');

  if (!calcModal || !petSelect || !breedSelect || !serviceSelect) return;

  // Открытие окна по клику на любую кнопку «Подробнее»
  document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', () => {
      calcModal.style.display = 'flex';
    });
  });

  // Закрытие окна
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      calcModal.style.display = 'none';
      resetCalculator();
    });
  }

  // Закрытие по клику на темный фон вокруг окна
  calcModal.addEventListener('click', (e) => {
    if (e.target === calcModal) {
      calcModal.style.display = 'none';
      resetCalculator();
    }
  });

  // Шаг 1: Выбор питомца (Собака / Кошка)
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

  // Шаг 2: Выбор конкретной породы
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

  // Шаг 3: Выбор услуги и моментальный расчет цены
  serviceSelect.addEventListener('change', function() {
    if (this.value) {
      const petType = petSelect.value;
      const breed = breedSelect.value;
      const price = priceData[petType].services[breed][this.value];
      
      finalPrice.innerText = price + ' ₽';
      resultBox.style.display = 'block'; // Показываем итоговый блок
    } else {
      resultBox.style.display = 'none';
    }
  });
// Вспомогательные функции очистки (ИСПРАВЛЕНО!)
function resetSelect(selectElement, defaultText) {
  selectElement.innerHTML = `<option value="">${defaultText}</option>`;
}

function resetCalculator() {
  petSelect.value = '';
  resetSelect(breedSelect, '-- Сначала выберите питомца --');
  resetSelect(serviceSelect, '-- Сначала выберите породу --'); /* <-- ИСПРАВИЛИ ТУТ */
  breedSelect.disabled = true;
  serviceSelect.disabled = true;
  resultBox.style.display = 'none';
}
}}
